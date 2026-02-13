import type { APIRoute } from "astro";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Validate contact form input
const validateContactForm = (data: unknown): ContactFormData | null => {
  if (typeof data !== "object" || data === null) return null;

  const form = data as Record<string, unknown>;

  if (
    typeof form.name !== "string" ||
    typeof form.email !== "string" ||
    typeof form.subject !== "string" ||
    typeof form.message !== "string"
  ) {
    return null;
  }

  if (
    !form.name.trim() ||
    !form.email.trim() ||
    !form.subject.trim() ||
    !form.message.trim()
  ) {
    return null;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email.trim())) {
    return null;
  }

  return {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
  };
};

export const POST: APIRoute = async ({ request }): Promise<Response> => {
  try {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await request.json();
    const validatedData = validateContactForm(data);

    if (!validatedData) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid or incomplete form data",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Implement actual email sending or database storage
    // For now, log the contact form submission
    console.log("Contact form submission:", validatedData);

    // Generate a simple ID for tracking
    const id = `contact-${Date.now()}`;

    const response: ContactResponse = {
      success: true,
      message: "Your message has been received. We will get back to you soon.",
      id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while processing your request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
