import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import "../css/contactForm.css";
import "../css/App.css";

export const ContactForm = () => {
  const [state, handleSubmit] = useForm("xkgwlaev");
  if (state.succeeded) {
    return (
      <div id="container">
        <h1 className='thanks'>Thank you for contacting me!</h1>
      </div>
    );
  }
  return (
    <div id="container">
    <h1>Get in Touch</h1>
      <p>Feel free to reach out to me for freelance work or to discuss projects.</p>
      <form id="fs-frm" className="contact-form-layout" name="simple-contact-form" acceptCharset="utf-8" action="https://formspree.io/f/xkgwlaev" method="post" onSubmit={handleSubmit}>
        <fieldset id="fs-frm-inputs">
          <input type="text" name="name" id="full-name" placeholder="Your Name" required />
          <ValidationError prefix="Name" field="name" errors={state.errors} />
          
          <input type="email" name="_replyto" id="email-address" placeholder="Your Email" required />
          <ValidationError prefix="Email" field="email" errors={state.errors} />
          
          <textarea rows="5" name="message" id="message" placeholder="Your Message" required></textarea>
          <ValidationError prefix="Message" field="message" errors={state.errors} />
          
          <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission" />
          <input type="submit" value="Submit" disabled={state.submitting} className='pdf-button' />
        </fieldset>
      </form>
    </div>
  );
};