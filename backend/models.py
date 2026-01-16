from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class ProjectRequirements(BaseModel):
    project_type: str = Field(..., description="e.g., 'Web App', 'Mobile App', 'API', 'IoT'")
    domain: str = Field(..., description="e.g., 'E-commerce', 'Healthcare', 'Social Media', 'Education'")
    expected_scale: str = Field(..., description="e.g., 'Small', 'Medium', 'Large'")
    team_size: str = Field(..., description="e.g., 'Solo', 'Small', 'Large'")
    budget: str = Field(..., description="e.g., 'Tight', 'Moderate', 'High'")
    priorities: List[str] = []
    # Legacy fields (kept optional for safety, but we will move to using priorities list)
    performance_critical: bool = False
    security_critical: bool = False
    offline_capability: bool = False
    hardware_integration: bool = False

class Technology(BaseModel):
    id: str
    name: str
    category: str = Field(..., description="e.g., 'Frontend', 'Backend', 'Database', 'DevOps', 'Hardware'")
    description: str
    tags: List[str] = []
    # Suitability scores or flags could go here, or we infer from tags. 
    # For now, let's keep it simple with explicit attributes matching requirements.
    min_scale: str = "Small" # Small, Medium, Large
    cost_tier: str = "Free" # Free, Moderate, Expensive
    key_benefits: List[str] = [] # Unique selling points / deep advantages
    attributes: Dict[str, bool] = Field(default_factory=dict) # e.g. {"high_performance": True}

class ScoredTechnology(BaseModel):
    technology: Technology
    score: float
    reason: List[str]

class CategoryResult(BaseModel):
    category: str
    top_pick: Optional[ScoredTechnology]
    alternatives: List[ScoredTechnology]

class DeploymentStrategy(BaseModel):
    title: str
    description: str
    recommended_platforms: List[str]

class RecommendationResponse(BaseModel):
    project_name: str = "My Project"
    results: List[CategoryResult]
    deployment_strategy: Optional[DeploymentStrategy] = None
