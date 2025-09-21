# Full Colab Code with multimodal text and image input

# Step 1: Install and configure API
# !pip install -q -U google-generativeai
import google.generativeai as genai
import os
from google.colab import userdata, files
from PIL import Image
from io import BytesIO
import requests

# Load the API key from Colab Secrets
os.environ['GOOGLE_API_KEY'] = userdata.get('GOOGLE_API_KEY')
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

# Step 2: Define the title generation function
def generate_titles_from_image(image_pil, prompt, model_name='gemini-2.5-flash'):
  """
  Generates title suggestions for a PIL Image object using the Gemini API.
  """
  try:
    content = [prompt, image_pil]
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(content)
    return response.text.strip().split('\n')
  except Exception as e:
    return [f"An error occurred: {e}"]

# Step 3: Handle user inputs
print("Please upload an image of an artisan object:")
uploaded = files.upload()

if uploaded:
  # Get the uploaded filename and data
  filename = next(iter(uploaded))
  image_data = uploaded[filename]
  image_stream = BytesIO(image_data)
  uploaded_image = Image.open(image_stream)
  print(f"Image '{filename}' uploaded successfully! 🎉")

  # Collect additional product information
  product_name = input("Enter the product name (e.g., 'Hand-carved wooden bowl'): ")
  category = input("Enter the product category (e.g., 'Home Decor', 'Kitchenware'): ")
  location = input("Enter the artist's location or origin (e.g., 'from Jaipur, India', 'made in Kyoto'): ")
  
  # Step 4: Refine the prompt with the collected information
  my_prompt = f"""
  You are a creative marketing assistant for an online marketplace for artisans. 
  Based on the following image and product details, generate 5 descriptive and compelling titles for a product listing. 
  The titles should be optimized for a global audience and highlight the product's unique qualities.

  Product Details:
  - **Product Name:** {product_name}
  - **Category:** {category}
  - **Location:** {location}

  Image: [image]

  Title Suggestions:
  """

  print("\nGenerating titles now...")
  
  # Step 5: Generate the titles
  title_suggestions = generate_titles_from_image(uploaded_image, my_prompt)

  # Step 6: Print the results
  print("\nHere are your optimized title suggestions:")
  for title in title_suggestions:
    print(f"- {title}")

else:
  print("No file was uploaded. Please try again.")