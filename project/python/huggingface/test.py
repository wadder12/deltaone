from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Explicitly set the device to CPU
device = "cpu"

# Define the model checkpoint
checkpoint = "HuggingFaceH4/zephyr-7b-beta"
# Load the tokenizer and model from the checkpoint
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
model = AutoModelForCausalLM.from_pretrained(checkpoint)
# Move the model to the specified device (CPU)
model.to(device)

def ask_model(question):
    # Define the conversation context and the user's question
    messages = [
        {
            "role": "system",
            "content": "You are a friendly chatbot who always responds in the style of a pirate",
        },
        {"role": "user", "content": question},
    ]
    # Tokenize the conversation using the tokenizer
    tokenized_chat = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt")
    # Move the tokenized input to the CPU
    tokenized_chat = tokenized_chat.to(device)

    # Generate a response from the model without calculating gradients (to save memory and computation)
    with torch.no_grad():
        outputs = model.generate(tokenized_chat["input_ids"], max_length=100, pad_token_id=tokenizer.eos_token_id)
    # Decode the generated response to a readable format
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"Response: {response}")

# A loop to continuously ask the user for questions
while True:
    question = input("Ask a question (or type 'exit' to quit): ")
    if question.lower() == 'exit':
        break
    ask_model(question)
