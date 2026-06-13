import yaml
import sys

def main():
    with open('docs/openapi.yaml.main', 'r') as f:
        main_spec = yaml.safe_load(f)
    
    with open('docs/openapi.yaml.ours', 'r') as f:
        ours_spec = yaml.safe_load(f)

    # Merge schemas
    our_schemas = [
        'VerificationRequest', 'VerificationResponse', 
        'RiskRequest', 'RiskResponse',
        'PreventionRequest', 'PreventionResponse'
    ]
    for s in our_schemas:
        if s in ours_spec['components']['schemas']:
            main_spec['components']['schemas'][s] = ours_spec['components']['schemas'][s]

    # Merge paths
    our_paths = ['/verification/verify', '/risk/analyze', '/prevent-checkout']
    for p in our_paths:
        if p in ours_spec['paths']:
            main_spec['paths'][p] = ours_spec['paths'][p]

    # Write merged
    class Dumper(yaml.Dumper):
        def increase_indent(self, flow=False, indentless=False):
            return super(Dumper, self).increase_indent(flow, False)

    with open('docs/openapi.yaml', 'w') as f:
        yaml.dump(main_spec, f, Dumper=Dumper, default_flow_style=False, sort_keys=False)

if __name__ == "__main__":
    main()
