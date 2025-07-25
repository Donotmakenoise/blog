// Notifications.js
import React, { useEffect, useState } from "react";

const Notifications = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/admin/contact-submissions");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setSubmissions(data.submissions);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div>
      <h2>Contact Form Submissions</h2>
      <ul>
        {submissions.map((submission) => (
          <li key={submission.id}>
            <strong>{submission.name}</strong> - {submission.email} <br />
            <em>Subject: {submission.subject}</em> <br />
            <p>{submission.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
