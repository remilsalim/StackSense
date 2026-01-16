import json
import os
from typing import List
from .models import ProjectRequirements, Technology, ScoredTechnology, CategoryResult, RecommendationResponse, DeploymentStrategy

KB_PATH = os.path.join(os.path.dirname(__file__), "data", "knowledge_base.json")

def load_technologies() -> List[Technology]:
    if not os.path.exists(KB_PATH):
        return []
    with open(KB_PATH, "r") as f:
        data = json.load(f)
    return [Technology(**item) for item in data]

def calculate_score(tech: Technology, reqs: ProjectRequirements) -> (float, List[str]):
    score = 0.0
    reasons = []

    # Basic Category/Role fit is assumed if we are filtering by category later.

    # 1. Scale Match
    # Map inputs to numeric scale: 1=Small, 2=Medium, 3=Large, 4=Enterprise
    scale_map = {
        "Prototype": 0,
        "Academic": 0,
        "Small": 1, 
        "Medium": 2, 
        "Large": 3, 
        "Enterprise": 4
    }
    
    # Map team sizes to roughly align with scale if needed, or just map 'expected_scale' directly
    # Let's trust 'expected_scale' primarily, but we can infer if needed.
    # For now, we stick to direct mapping.
    
    tech_min_scale_val = scale_map.get(tech.min_scale, 1)
    
    # Handle "Enterprise (Global)" etc by partial matching or cleaner normalization
    input_scale = reqs.expected_scale
    if "Prototype" in input_scale: req_scale_val = 0
    elif "Academic" in input_scale: req_scale_val = 0
    elif "Small" in input_scale: req_scale_val = 1
    elif "Medium" in input_scale: req_scale_val = 2
    elif "Large" in input_scale: req_scale_val = 3
    elif "Enterprise" in input_scale: req_scale_val = 4
    else: req_scale_val = 1

    scale_text = {0: "Prototype/Research", 1: "Small", 2: "Medium", 3: "Large", 4: "Enterprise"}.get(req_scale_val, "Unknown")
    
    # Special Academic Logic
    if "Academic" in input_scale:
        if "python" in tech.tags:
             score += 3.0
             reasons.append("Python is the standard for academic research and reproducibility.")
        if tech.category == "Database" and "sql" in tech.tags:
             # Maybe prefer simpler DBs or files, but SQL is standard.
             pass
        if tech.cost_tier == "Free":
             score += 2.0
             reasons.append("Free/Open Source fits academic budgets.")

    if tech_min_scale_val > req_scale_val:
        score -= 5.0
        reasons.append(f"Often too complex/heavy for a {scale_text} scale project.")
    else:
        # Bonus for exact match or comfortable room to grow
        if tech_min_scale_val == req_scale_val:
            score += 3.0
            reasons.append(f"Perfectly sized for {scale_text} scale without over-engineering.")
        else:
            score += 1.0
            reasons.append(f"Scales comfortably to {scale_text} size.")

    # 2. Performance
    if reqs.performance_critical:
        if tech.attributes.get("high_performance"):
            score += 5.0
            reasons.append("Excellent performance matches your critical requirement.")
        else:
            score -= 2.0
            reasons.append("May hit performance bottlenecks for critical workloads.")
    
    # 3. Budget / Cost Sensitivity (New)
    budget_friendly = ["Free", "Open Source"]
    if reqs.budget in ["Tight", "Zero ($0) - Open Source only"]:
        if tech.cost_tier in budget_friendly or tech.cost_tier == "Free":
            score += 2.0
            reasons.append("Cost-effective / Open Source (Fits budget).")
        elif tech.cost_tier == "Expensive":
             score -= 5.0
             reasons.append("Likely exceeds tight budget constraints.")

    # 4. Project Type & Domain context
    if reqs.project_type in ["Web App", "SaaS Platform", "Progressive Web App (PWA)", "CMS / Blog Platform", "Static Website / Portfolio"]:
        if tech.category == "Frontend" and "web" in tech.tags:
            score += 3.0
            reasons.append("Standard choice for modern Web/SaaS Applications.")
        if tech.category == "Backend" and "api" in tech.tags:
             score += 1.0 
    
    if reqs.project_type == "Static Website / Portfolio":
         if tech.id == "nextjs":
             score += 4.0
             reasons.append("Next.js Static Generation is perfect for portfolios.")
         if tech.attributes.get("seo_friendly"):
             score += 3.0
             reasons.append("Critical for portfolio/website discoverability.")
         if tech.category in ["Backend", "Database"]:
             score -= 2.0
             reasons.append("Probably overkill for a static site (unless using headless CMS).")

    if reqs.project_type == "Progressive Web App (PWA)":
        if tech.id in ["react", "vue", "nextjs"]:
             score += 2.0
             reasons.append("Great ecosystem for building PWA features.")
        if tech.attributes.get("offline_capability"):
             score += 3.0
             reasons.append("Essential for PWA offline functionality.")

    if reqs.project_type == "Microservices Architecture":
        if tech.category == "DevOps" or tech.category == "Backend":
             if "containerization" in tech.tags or "async" in tech.tags:
                 score += 4.0
                 reasons.append("Ideal building block for distributed Microservices.")
        if tech.id == "docker":
             score += 5.0
             reasons.append("Virtually mandatory for managing microservices.")

    if reqs.project_type == "Browser Extension":
        if tech.category == "Frontend":
             score += 3.0
             reasons.append("Modern extensions are widely built with Web Frameworks.")
        if tech.id == "react":
             score += 2.0
             reasons.append("Community favorite for complex extension UIs.")

    if reqs.project_type == "Data Science / ML Pipeline":
        if "python" in tech.tags:
             score += 5.0
             reasons.append("Python ecosystem is industry standard for Data Science/ML.")
        if "sql" in tech.tags:
             score += 2.0
             reasons.append("Essential for data handling.")

    if reqs.domain == "E-commerce":
        if tech.attributes.get("data_integrity") or (tech.category == "Database" and "sql" in tech.tags):
            score += 4.0
            reasons.append("Strong data integrity - Critical for financial/order transactions.")
        if tech.category == "Frontend" and tech.attributes.get("seo_friendly"):
             score += 2.0
             reasons.append("SEO is vital for E-commerce discovery.")

    if reqs.domain == "Fintech":
         if tech.attributes.get("security_critical") or tech.attributes.get("data_integrity"):
              score += 5.0
              reasons.append("High security & consistency required for Fintech.")

    # 5. Security
    if reqs.security_critical:
        if tech.attributes.get("security_critical"):
            score += 4.0
            reasons.append("Hardened security features included.")
        elif "popular" in tech.tags:
             score += 1.0
             reasons.append("Large community helps identify security issues quickly.")

    # 5. Priorities (New List Handling)
    # Map legacy booleans to new list if list is empty (for backward compat)
    active_priorities = reqs.priorities
    if not active_priorities:
        if reqs.performance_critical: active_priorities.append("Performance & Efficiency")
        if reqs.security_critical: active_priorities.append("Security & Privacy")
        if reqs.offline_capability: active_priorities.append("Offline Capability") # Custom internal mapping
        if reqs.hardware_integration: active_priorities.append("Hardware Integration")

    if "Performance & Efficiency" in active_priorities:
        if tech.attributes.get("performance") == "High":
            score += 4.0
            reasons.append("High Performance matches your efficiency priority.")
        elif tech.attributes.get("performance") == "Low":
             score -= 2.0
             reasons.append("May not meet performance needs.")

    if "Security & Privacy" in active_priorities:
         if tech.attributes.get("security") == "High":
             score += 4.0
             reasons.append("Strong security profile.")
         if tech.id in ["rust", "java", "csharp"]:
             score += 1.0

    if "Scalability" in active_priorities:
        if tech.min_scale == "Small": # Easy to start but hard to scale? No, usually reverse.
            pass
        if tech.id in ["kubernetes", "go", "elixir", "aws", "google_cloud"]:
             score += 3.0
             reasons.append("Built for massive scalability.")

    if "Development Speed" in active_priorities or "Time-to-Market" in active_priorities:
        if tech.attributes.get("learning_curve") == "Low":
             score += 3.0
             reasons.append("Rapid development / Quick time-to-market.")
        if tech.id in ["python", "javascript", "ruby", "vercel", "firebase"]:
             score += 2.0
    
    if "Maintainability" in active_priorities:
        if tech.attributes.get("type_safety"): # TypeScript, Rust, Go, Java
             score += 3.0
             reasons.append("Static typing improves long-term maintainability.")

    if "Cost Efficiency" in active_priorities:
        if tech.cost_tier == "Free":
             score += 4.0
             reasons.append("Free/Open Source maximizes cost efficiency.")
        if tech.cost_tier == "Paid":
             score -= 2.0

    if "Power & Resource Efficiency" in active_priorities:
        if tech.id in ["c", "cpp", "rust"]:
             score += 5.0
             reasons.append("Extremely resource efficient (system level).")
        if tech.id in ["electron"]: # Electron is known resource hog
             score -= 3.0
             reasons.append("Known for high memory usage.")

    # Legacy/Specific mappings for boolean-like features
    if "Hardware Integration" in active_priorities and tech.category != "Hardware":
         # Logic moved to main filter loop, but we can boost keys
         pass

    # Hardware Filter Logic (Updated)
    # Only recommend Hardware category if "Hardware Integration" is explicitly requested
    # OR if Project Type is IoT/Robotics/Embedded
    hardware_needed = ("Hardware Integration" in active_priorities) or (reqs.project_type in ["IoT System", "Robotics System", "Embedded System Software", "Device Driver"])
    
    if tech.category == "Hardware" and not hardware_needed:
        return 0, [] # Hard filter: Don't show generic RPi for a Web App unless asked

    # 6. Team Size
    if reqs.team_size == "Solo":
        if tech.attributes.get("rapid_development"):
             score += 4.0
             reasons.append("Rapid development speed is great for solo founders.")
        if "complex-queries" in tech.tags and tech.category == "Database":
             score -= 1.0
             reasons.append("Might have a steeper learning curve for a solo dev.")

    # 7. Offline / Hardware
    if reqs.offline_capability and tech.attributes.get("offline_capability"):
        score += 5.0
        reasons.append("Native offline support.")
    
    if reqs.hardware_integration:
        if tech.category == "Hardware":
             score += 10.0
             reasons.append("Required hardware component.")
        if tech.attributes.get("hardware_integration"):
            score += 3.0
            reasons.append("Excellent hardware GPIO/Integration support.")

    # 8. SEO specifics
    if reqs.project_type == "Web App" and tech.category == "Frontend":
         if tech.attributes.get("seo_friendly"):
             score += 4.0
             reasons.append("SEO Optimized (Server-Side Rendering/Static Generation).")
         elif not tech.attributes.get("seo_friendly") and reqs.domain in ["E-commerce", "Social Media", "Education"]:
             score -= 3.0
             reasons.append("Client-side rendering may hurt SEO rankings.")

    return score, reasons

from .models import ProjectRequirements, Technology, ScoredTechnology, CategoryResult, RecommendationResponse, DeploymentStrategy

# ... existing code ...

def determine_deployment_strategy(reqs: ProjectRequirements) -> DeploymentStrategy:
    # 1. Static / Frontend Heavy
    if reqs.project_type in ["Static Website / Portfolio", "Browser Extension"]:
        return DeploymentStrategy(
            title="Static Cloud / CDN",
            description="Your project is primarily frontend-driven. Deploying to a global CDN is the fastest, cheapest, and most scalable option.",
            recommended_platforms=["Vercel", "Netlify", "GitHub Pages"]
        )
    
    # 2. Serverless / PWA / Web App (Small/Medium)
    if "Serverless" in reqs.priorities or reqs.expected_scale in ["Prototype / MVP", "Small (Hundreds of users)"]:
        return DeploymentStrategy(
            title="Serverless / PaaS",
            description="Focus on code, not infrastructure. Platform-as-a-Service (PaaS) handles scaling automatically.",
            recommended_platforms=["Vercel (for Next.js)", "Heroku", "Railway", "Render"]
        )

    # 3. Microservices / Enterprise / Large Scale
    if reqs.project_type == "Microservices Architecture" or reqs.expected_scale in ["Large (Millions of users)", "Enterprise (Global scale)"]:
        return DeploymentStrategy(
            title="Container Orchestration / Cloud Native",
            description="For massive scale and control, use Docker containers managed by Kubernetes or specific Cloud Run services.",
            recommended_platforms=["AWS EKS / ECS", "Google Cloud Run", "Azure Kubernetes Service"]
        )
        
    # 4. Mobile Apps
    if reqs.project_type == "Mobile App":
        return DeploymentStrategy(
            title="App Stores & Mobile CI/CD",
            description="Deployment means publishing to the Apple App Store and Google Play Store, managing updates via OTA (like Expo) or standard releases.",
            recommended_platforms=["Apple App Store", "Google Play Store", "Expo EAS"]
        )

    # 5. IoT / Hardware
    if reqs.project_type in ["IoT System", "Embedded System Software"]:
        return DeploymentStrategy(
            title="Device Fleet Management",
            description="You need to push firmware updates to physical devices securely over-the-air (OTA).",
            recommended_platforms=["AWS IoT Greengrass", "BalenaCloud", "Particle"]
        )

    # Default Fallback
    return DeploymentStrategy(
        title="Modern Cloud VPS / PaaS",
        description="A balanced approach using comprehensive cloud providers.",
        recommended_platforms=["DigitalOcean", "AWS Lightsail", "Linode"]
    )

def generate_recommendation(reqs: ProjectRequirements) -> RecommendationResponse:
    all_techs = load_technologies()
    categories = ["Frontend", "Backend", "Database", "DevOps", "Hardware"]
    
    results = []

    for cat in categories:
        # Filter Hardware if not requested
        if cat == "Hardware" and not reqs.hardware_integration:
            continue

        techs_in_cat = [t for t in all_techs if t.category == cat]
        if not techs_in_cat:
            continue
        
        scored_techs = []
        for tech in techs_in_cat:
            score, reasons = calculate_score(tech, reqs)
            scored_techs.append(ScoredTechnology(technology=tech, score=score, reason=reasons))
        
        # Sort by score descending
        scored_techs.sort(key=lambda x: x.score, reverse=True)
        
        top_pick = scored_techs[0] if scored_techs else None
        alternatives = scored_techs[1:] if len(scored_techs) > 1 else []
        
        results.append(CategoryResult(
            category=cat,
            top_pick=top_pick,
            alternatives=alternatives
        ))
    
    deployment = determine_deployment_strategy(reqs)

    return RecommendationResponse(
        project_name=f"{reqs.domain} {reqs.project_type}",
        results=results,
        deployment_strategy=deployment
    )
