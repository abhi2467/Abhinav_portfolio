# Abhinav Chauhan — Portfolio

A personal portfolio website showcasing my projects, technical skills, learning journey, certifications, resume, and contact information.

## Live Website

After enabling GitHub Pages, your website will be available at:

`https://YOUR-GITHUB-USERNAME.github.io/`

Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

## About

I am an MCA student interested in web application development and building responsive, database-driven applications. This portfolio brings together selected projects, technologies I work with, certifications, and ways to connect with me.

## Features

- Responsive portfolio layout for desktop, tablet, and mobile
- Light and dark theme toggle
- Mobile navigation menu
- Active navigation while scrolling
- Scroll-reveal animations and animated statistics
- Project cards with category filters
- Certificate image lightbox
- Resume download and online viewing links
- Contact form integration using EmailJS

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Icons:** Font Awesome
- **Contact form:** EmailJS Browser SDK
- **Hosting:** GitHub Pages (static website hosting)

## Folder Structure

```text
Abhinav_portfolio/
├── index.html
├── README.md
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── assets/
        ├── certificates/
        ├── projects/
        ├── resume/
        ├── favicon.png
        ├── favicon.svg
        └── og-cover.jpg
```

## Run Locally

This is a static HTML, CSS, and JavaScript website. No backend installation is required to preview the portfolio.

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-GITHUB-USERNAME.github.io.git
   ```

2. Open the project folder.
3. Open `index.html` in a browser, or use the **Live Server** extension in Visual Studio Code.

## Configure the Contact Form (EmailJS)

The contact form uses EmailJS to send messages from the browser. To make it work with your own EmailJS account:

1. Create an account at [EmailJS](https://www.emailjs.com/).
2. Connect and authorize the email service you want to send from.
3. Create an email template with these exact template variables:

   - `{{from_name}}`
   - `{{reply_to}}`
   - `{{subject}}`
   - `{{message}}`

4. In `static/js/main.js`, set your EmailJS values:

   ```javascript
   var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
   var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
   ```

5. In the EmailJS template, set **Reply To** to `{{reply_to}}` and set **To Email** to the inbox where you want to receive portfolio messages.
6. Save the template and reconnect/reauthorize your email service if EmailJS reports an authorization error.
7. Test the form using your deployed website.

The EmailJS Browser SDK must load **before** the portfolio JavaScript in `index.html`:

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@5/dist/email.min.js"></script>
<script src="static/js/main.js" defer></script>
```

The EmailJS public key is intended for browser use, but never put an EmailJS private key, email password, or other secret credentials in frontend files or a public repository. Configure allowed origins / domain restrictions in EmailJS for your deployed website. Consider enabling CAPTCHA or other anti-spam protection before sharing the form publicly.

## Contact

- **Name:** Abhinav Chauhan
- **Email:** rajputabhinav4163@gmail.com
- **GitHub:** [@abhi2467](https://github.com/abhi2467)
- **LinkedIn:** [Abhinav Chauhan](https://www.linkedin.com/in/abhinav-chauhan-mca-student/)

---

Made with HTML, CSS, and JavaScript by **Abhinav Chauhan**.
