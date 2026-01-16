from backend.models import ProjectRequirements
from backend.engine import generate_recommendation

req = ProjectRequirements(
    project_type="Web App",
    domain="E-commerce",
    expected_scale="Medium",
    team_size="Small",
    budget="Moderate",
    performance_critical=True,
    security_critical=True,
    offline_capability=False,
    hardware_integration=False
)

rec = generate_recommendation(req)
print("Project:", rec.project_name)
for res in rec.results:
    if res.top_pick:
        print(f"{res.category}: {res.top_pick.technology.name} (Score: {res.top_pick.score})")
