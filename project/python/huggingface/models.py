import requests
import yaml

response = requests.get("https://huggingface.co/api/models")

if response.status_code == 200:
    models = response.json()
    model_ids = [model['modelId'] for model in models]
    models_yaml = yaml.dump(model_ids, allow_unicode=True)
    
    file_name = "huggingface_models.yml" # need to change path
    
    with open(file_name, 'w') as file:
        file.write(models_yaml)
    
    print(f"Model IDs saved to {file_name}")
else:
    print("Failed to fetch models")
