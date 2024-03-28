from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

device = "cpu"

checkpoint = "HuggingFaceH4/zephyr-7b-beta"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(checkpoint)
model.to(device)

def ask_model(question):
    messages = [
        {
            "role": "system",
            "content": "You are a friendly chatbot who always responds in the style of a pirate",
        },
        {"role": "user", "content": question},
    ]
    tokenized_chat = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")
    tokenized_chat = tokenized_chat.to(device)

    with torch.no_grad():
        outputs = model.generate(tokenized_chat["input_ids"], max_length=100, pad_token_id=tokenizer.eos_token_id)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Response: {response}")

while True:
    question = input("Ask a question (or type 'exit' to quit): ")
    if question.lower() == 'exit':
        break
    ask_model(question)
