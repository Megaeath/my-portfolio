# My Portfolio

Welcome to my personal portfolio! This project showcases my skills, experiences, and projects in a modern and visually appealing way.

## Features

- **Responsive Design**: Optimized for all devices, from desktops to mobile phones.
- **Modern UI/UX**: Incorporates glassmorphism, gradients, and animations.
- **Dynamic Content**: Easily customizable data for projects, skills, and more.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/my-portfolio.git
   ```

2. Navigate to the project directory:

   ```bash
   cd my-portfolio
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run start
   ```

## Deployment

To deploy the portfolio:

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:

   ```bash
   npm run deploy
   ```

## Docker Support

Build and run the portfolio using Docker:

1. Build the Docker image:

   ```bash
   docker build -t my-portfolio .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 my-portfolio
   ```

## Hosting on Google Cloud Storage

1. Build the application:

   ```bash
   npm run build
   ```

2. Create a bucket on Google Cloud Storage:

   ```bash
   gsutil mb -p [PROJECT_ID] -l asia-southeast1 -b on gs://[YOUR_BUCKET_NAME]
   ```

3. Set permissions for the bucket:

   ```bash
   gsutil uniformbucketlevelaccess set on gs://[YOUR_BUCKET_NAME]
   gsutil iam ch allUsers:objectViewer gs://[YOUR_BUCKET_NAME]
   ```

4. Upload the build files:

   ```bash
   gsutil cp -r build/* gs://[YOUR_BUCKET_NAME]
   ```

## About

This portfolio is a reflection of my journey as a developer. It highlights my projects, skills, and achievements. Feel free to explore and connect with me!

---

**Note**: This project is entirely my own work and is not based on any other repository.
