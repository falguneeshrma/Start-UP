/**
 * Google Apps Script to automatically generate the "Project Wallah — Custom Project Request" form.
 *
 * HOW TO RUN (Takes ~10 seconds):
 * 1. Open your browser and go to: https://script.google.com/home
 * 2. Click "+ New project" (top left)
 * 3. Delete any code in the editor (Code.gs) and paste this ENTIRE file into it.
 * 4. Click the "Save" icon (disk icon or Ctrl+S).
 * 5. Click "Run" (play button at top).
 * 6. If prompted, click "Review Permissions" -> Select your Google account -> "Advanced" -> "Go to Untitled project (unsafe)" -> "Allow".
 * 7. Look at the "Execution log" at the bottom:
 *    - Copy the "RESPONDER URL"
 *    - Paste it into your `frontend/.env` file as:
 *      VITE_CUSTOM_PROJECT_FORM_URL=https://docs.google.com/forms/d/e/.../viewform
 *
 * The script automatically:
 * - Creates all 5 sections & 14 questions according to the specification
 * - Sets jamadarsomnath3@gmail.com as editor/admin
 * - Generates and links a connected Google Spreadsheet for response tracking
 * - Makes the form accessible to anyone with the link (no forced login)
 */

function createProjectWallahCustomProjectForm() {
  const ADMIN_EMAIL = 'jamadarsomnath3@gmail.com';

  // 1. Create Google Form
  const form = FormApp.create('Project Wallah — Custom Project Request');
  form.setDescription(
    'Can’t find the right project in our library? Tell us what you need. ' +
    'Share your project requirements, preferred technologies, budget and deadline, ' +
    'and our team will review your request and contact you with the next steps.'
  );

  // Settings per specification: Publicly accessible, no forced 1-response signin
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);

  // ─────────────────────────────────────────────────────────────
  // SECTION 1 — PROJECT INFORMATION
  // ─────────────────────────────────────────────────────────────
  // Item 1: Project Title / Topic Name
  const item1 = form.addTextItem();
  item1.setTitle('Project Title / Topic Name')
       .setHelpText('e.g. AI-Powered Early Disease Prediction System Using Deep Learning')
       .setRequired(true);

  // Item 2: Domain / Department
  const item2 = form.addListItem();
  item2.setTitle('Domain / Department')
       .setChoiceValues([
         'Computer Science & Engineering',
         'Information Technology',
         'Artificial Intelligence & Data Science',
         'Artificial Intelligence & Machine Learning',
         'Electronics & Telecommunication',
         'Electronics Engineering',
         'Mechanical Engineering',
         'Civil Engineering',
         'Electrical Engineering',
         'MBA / Management',
         'BCA / MCA',
         'Other'
       ])
       .setRequired(true);

  // Item 3: Academic Level / Project Type
  const item3 = form.addListItem();
  item3.setTitle('Academic Level / Project Type')
       .setChoiceValues([
         'Mini Project',
         'Major Project',
         'Final Year Project',
         'Semester Project',
         'Diploma Project',
         'Research Project',
         'Internship Project',
         'Other'
       ])
       .setRequired(true);

  // ─────────────────────────────────────────────────────────────
  // SECTION 2 — TECHNICAL REQUIREMENTS
  // ─────────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Section 2 — Technical Requirements');

  // Item 4: Preferred Technologies / Tools
  const item4 = form.addCheckboxItem();
  item4.setTitle('Preferred Technologies / Tools')
       .setChoiceValues([
         'Python',
         'Java',
         'C++',
         'JavaScript',
         'TypeScript',
         'React',
         'Next.js',
         'Node.js',
         'Django',
         'Flask',
         'FastAPI',
         'Spring Boot',
         'MySQL',
         'PostgreSQL',
         'MongoDB',
         'Firebase',
         'Machine Learning',
         'Deep Learning',
         'Generative AI',
         'NLP',
         'Computer Vision',
         'IoT / Arduino',
         'Flutter',
         'Android'
       ])
       .showOtherOption(true)
       .setRequired(false);

  // Other Technologies / Tools
  const item4b = form.addTextItem();
  item4b.setTitle('Other Technologies / Tools (if any)')
        .setHelpText('Specify any other tools, libraries, hardware, or frameworks')
        .setRequired(false);

  // Item 5: Detailed Requirements & Features
  const item5 = form.addParagraphTextItem();
  item5.setTitle('Detailed Requirements & Features')
       .setHelpText('Describe core functionality, required modules, algorithms, college guidelines, dataset preferences, integrations, or any specific features needed.')
       .setRequired(true);

  // ─────────────────────────────────────────────────────────────
  // SECTION 3 — DELIVERABLES
  // ─────────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Section 3 — Deliverables');

  // Item 6: What do you need?
  const item6 = form.addCheckboxItem();
  item6.setTitle('What do you need?')
       .setChoiceValues([
         'Full Working Source Code',
         'Project Synopsis',
         'Abstract',
         'IEEE / University Format Report',
         'SRS / Design Documentation',
         'Presentation / PPT',
         'Viva Questions & Answers',
         'Setup / Installation Guide',
         'Demo / Video Guide',
         'Database Schema / SQL Scripts',
         'Dataset / Sample Data'
       ])
       .showOtherOption(true)
       .setRequired(true);

  // ─────────────────────────────────────────────────────────────
  // SECTION 4 — BUDGET & DEADLINE
  // ─────────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Section 4 — Budget & Deadline');

  // Item 7: Expected Budget
  const item7 = form.addMultipleChoiceItem();
  item7.setTitle('Expected Budget')
       .setChoiceValues([
         '₹1,000–₹2,500',
         '₹2,500–₹5,000',
         '₹5,000–₹10,000',
         '₹10,000–₹20,000',
         '₹20,000+',
         'Not sure / Need recommendation'
       ])
       .setRequired(true);

  // Item 8: Submission Deadline
  const item8 = form.addDateItem();
  item8.setTitle('Submission Deadline')
       .setHelpText('Select your actual submission deadline date')
       .setRequired(true);

  // ─────────────────────────────────────────────────────────────
  // SECTION 5 — STUDENT DETAILS
  // ─────────────────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Section 5 — Student Details')
       .setHelpText('Your information is used only to review and respond to your project request.');

  // Item 9: Full Name
  const item9 = form.addTextItem();
  item9.setTitle('Full Name')
       .setRequired(true);

  // Item 10: Email Address
  const item10 = form.addTextItem();
  item10.setTitle('Email Address')
        .setHelpText('We will send quotes and project updates here')
        .setRequired(true);

  // Item 11: Phone / WhatsApp Number
  const item11 = form.addTextItem();
  item11.setTitle('Phone / WhatsApp Number')
        .setHelpText('For instant communication and milestone updates')
        .setRequired(true);

  // Item 12: College / University
  const item12 = form.addTextItem();
  item12.setTitle('College / University')
        .setHelpText('e.g. VJTI, SPPU Pune, MIT-WPU, etc.')
        .setRequired(false);

  // Item 13: College Guidelines / Additional Notes
  const item13 = form.addParagraphTextItem();
  item13.setTitle('College Guidelines / Additional Notes')
        .setHelpText('Any specific format constraints, IEEE rules, or deadlines')
        .setRequired(false);

  // Item 14: Preferred Contact Method
  const item14 = form.addMultipleChoiceItem();
  item14.setTitle('Preferred Contact Method')
        .setChoiceValues([
          'WhatsApp',
          'Phone Call',
          'Email',
          'Telegram'
        ])
        .setRequired(true);

  // ─────────────────────────────────────────────────────────────
  // ADMIN ACCESS & GOOGLE SHEET CONNECTION
  // ─────────────────────────────────────────────────────────────
  // Add jamadarsomnath3@gmail.com as editor/admin to the form
  try {
    form.addEditor(ADMIN_EMAIL);
  } catch (e) {
    Logger.log('Notice: Could not automatically add editor ' + ADMIN_EMAIL + ': ' + e.message);
  }

  // Create response Google Sheet & link it
  const ss = SpreadsheetApp.create('Project Wallah — Custom Project Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  try {
    ss.addEditor(ADMIN_EMAIL);
  } catch (e) {
    Logger.log('Notice: Could not automatically add spreadsheet editor ' + ADMIN_EMAIL + ': ' + e.message);
  }

  const responderUrl = form.getPublishedUrl();
  const editUrl = form.getEditUrl();
  const sheetUrl = ss.getUrl();

  Logger.log('\n======================================================');
  Logger.log('SUCCESS! Google Form & Sheet created successfully.');
  Logger.log('Admin Email Assigned: ' + ADMIN_EMAIL);
  Logger.log('RESPONDER URL (Copy this into frontend/.env):');
  Logger.log(responderUrl);
  Logger.log('------------------------------------------------------');
  Logger.log('Edit Form URL: ' + editUrl);
  Logger.log('Responses Sheet URL: ' + sheetUrl);
  Logger.log('======================================================\n');

  return {
    responderUrl: responderUrl,
    editUrl: editUrl,
    sheetUrl: sheetUrl,
  };
}
