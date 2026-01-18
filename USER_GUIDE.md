# 📖 SkillXIntell User Guide

**Complete Step-by-Step Guide to Using SkillXIntell Platform**

This guide walks you through every feature of SkillXIntell, from initial setup to advanced functionality across Healthcare, Agriculture, and Urban Technology sectors.

---

## 🎯 Step-by-Step User Flow

### Getting Started Journey

#### 1️⃣ **Registration & Onboarding** (2 minutes)
```
1. Navigate to http://localhost:3000 (or production URL)
2. Click "Sign Up" or "Register"
3. Fill in registration form:
   - Name
   - Email
   - Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
   - Select role: STUDENT, EDUCATOR, EMPLOYEE, or ADMIN
4. Click "Create Account"
5. Automatic redirect to login page
```

#### 2️⃣ **Login & Dashboard Access** (30 seconds)
```
1. Enter email and password
2. Click "Sign In"
3. JWT token stored automatically
4. Redirected to main dashboard with overview of all three sectors
```

#### 3️⃣ **Profile Setup** (3 minutes)
```
1. Click "Profile" in navigation
2. Upload avatar (optional):
   - Click avatar placeholder
   - Select image (JPG, PNG, GIF - max 2MB)
   - Image uploads to Supabase Storage
3. Add bio and social links (LinkedIn, GitHub, Twitter)
4. Select sector preferences (Healthcare, Agriculture, Urban)
5. Click "Save Changes"
```

#### 4️⃣ **Adding Your First Skill** (2 minutes)
```
1. Navigate to "Skills" from dashboard or sidebar
2. Click "Add New Skill" button
3. Fill in skill details:
   - Skill Name (e.g., "Data Analysis")
   - Select Sector (Healthcare/Agriculture/Urban)
   - Choose Category (Technical, Soft Skills, etc.)
   - Set Proficiency Level (1-5 stars)
   - Add tags (optional)
   - Write description (optional)
4. Click "Add Skill"
5. Skill appears in your skills list with proficiency visualization
```

#### 5️⃣ **Creating Your First Project** (4 minutes)
```
1. Go to "Projects" section
2. Click "Add Project"
3. Enter project information:
   - Project Title
   - Description (what you built)
   - Select Sector
   - Choose Category (e.g., "Data Analytics", "Web Development")
   - Skills Used (select from your skills or add new)
   - Technologies (e.g., "React, Node.js, PostgreSQL")
   - Outcomes achieved
   - Impact statement
   - Start and End dates
   - Status (IN_PROGRESS, COMPLETED, PLANNED)
   - Team size and your role
   - Repository URL (GitHub link)
   - Live Demo URL (optional)
   - Visibility: Public/Private
4. Click "Create Project"
5. Project added to portfolio with status badge
```

#### 6️⃣ **Adding Certifications** (3 minutes)
```
1. Navigate to "Certifications"
2. Click "Add Certification"
3. Fill in certification details:
   - Certification Name (e.g., "AWS Certified Solutions Architect")
   - Issuing Organization
   - Issue Date
   - Expiry Date (if applicable)
   - Credential ID/URL
   - Select related skills
   - Status: ACTIVE or EXPIRED
4. Click "Save Certification"
5. Certification appears with expiry tracking
```

#### 7️⃣ **Exploring Sector Dashboards** (5 minutes)

**Healthcare Dashboard:**
```
1. Click "Healthcare" card from main dashboard
2. View your healthcare-specific metrics:
   - Total healthcare skills
   - Active certifications (CPHIMS, CAHIMS, etc.)
   - Healthcare projects count
   - Competency score
3. Explore quick actions:
   - Healthcare Skills → Manage EHR, FHIR, HL7 skills
   - Healthcare Certifications → Track medical IT credentials
   - Healthcare Projects → Portfolio of health informatics projects
4. Scroll to "Career Pathways":
   - View AI-recommended roles (Health Data Analyst, Clinical Informaticist)
   - See salary ranges and demand levels
   - Explore Udemy course recommendations for each role
5. Check "Assessment" for readiness score
6. Click "Back to Dashboard" to return to main view
```

**Agriculture Dashboard:**
```
1. Click "Agriculture" from main dashboard
2. View agritech metrics:
   - Agricultural skills count
   - Innovation readiness score
   - Completed agri-projects
3. Explore agriculture categories:
   - Precision Farming
   - Crop Management
   - Soil Health Monitoring
   - Supply Chain Optimization
4. Review career paths in AgriTech
5. Get course recommendations for agricultural technology
6. Click "Back to Dashboard" to return to main view
```

**Urban Technology Dashboard:**
```
1. Click "Urban" from main dashboard
2. View smart city metrics:
   - Urban planning skills
   - Smart city projects
   - Transformation readiness score
3. Explore categories:
   - IoT & Smart Infrastructure
   - Urban Data Analytics
   - Sustainable City Planning
   - Transportation Systems
4. See urban development career pathways
5. Click "Back to Dashboard" to return to main view
```

#### 8️⃣ **Managing Sector-Specific Content**

**From Sector Dashboard:**
```
1. Navigate to any sector (Healthcare/Agriculture/Urban)
2. Access sector-specific pages:
   - Skills → Click "Back to [Sector]" to return
   - Projects → Click "Back to [Sector]" to return
   - Certifications → Click "Back to [Sector]" to return
   - Assessment → View all skills, projects, certifications scored
3. Each page has breadcrumb navigation for easy movement
```

#### 9️⃣ **Getting AI Recommendations** (2 minutes)
```
1. From any sector dashboard, scroll to "AI Recommendations"
2. System analyzes your:
   - Current skills and proficiency levels
   - Projects completed
   - Certifications earned
   - Sector focus
3. View personalized recommendations:
   - Skill gaps to fill
   - Next projects to undertake
   - Courses to take (Udemy integration)
   - Career paths aligned with your profile
4. Click on course recommendations to view details:
   - Course title, instructor, rating
   - Duration and level
   - Direct link to Udemy
```

#### 🔟 **Using the AI Chatbot** (3 minutes)
```
1. Navigate to "Analytics" page from main dashboard
2. Scroll to the chatbot section at the bottom of the Analytics page
3. Start conversation with AI assistant:
   - "What skills should I focus on for healthcare data analysis?"
   - "Recommend projects for my agriculture portfolio"
   - "How do I become a smart city consultant?"
3. Chatbot (powered by OpenRouter) provides:
   - Personalized career guidance
   - Skill development roadmaps
   - Resource recommendations
   - Context-aware responses based on your profile
4. Chat history saved for reference
```

#### 1️⃣1️⃣ **Cross-Sector Analytics** (4 minutes)
```
1. Click "Analytics" in navigation
2. View comprehensive analytics:
   - Skills distribution across all sectors
   - Proficiency radar chart
   - Project completion timeline
   - Certification status overview
   - Top skills by sector
3. Compare your readiness across sectors:
   - Healthcare: 75% ready
   - Agriculture: 60% ready
   - Urban: 45% ready
4. Identify skill gaps with visual charts
5. Export analytics (future feature)
```

#### 1️⃣2️⃣ **Skill Verification** (Optional - 5 minutes)
```
1. Go to "Verification" section
2. Request verification for a skill:
   - Select skill to verify
   - Choose an educator/mentor as verifier
   - Add context/evidence (projects, certificates)
3. Send verification request
4. Track request status (Pending/Approved/Rejected)
5. Once verified, skill shows "Verified" badge
6. If you're an EDUCATOR:
   - Receive verification requests from students
   - Review evidence
   - Approve/reject with feedback
```

#### 1️⃣3️⃣ **Mentor Networking** (Optional)
```
1. Navigate to "Mentors" section
2. Browse approved mentors by sector
3. View mentor profiles:
   - Expertise areas
   - Experience level
   - Available sectors
4. Send connection request to mentor
5. Track request status
6. Start mentorship relationship
```

---

## 🎓 Typical User Workflows

### 🎯 Student Workflow
```
Day 1: Register → Setup Profile → Add Skills (from courses)
Week 1: Add Projects (class assignments) → Request Skill Verification
Month 1: Get Course Recommendations → Track Progress → Explore Career Pathways
Ongoing: Update skills, add new projects, maintain portfolio
```

**Example User Story - Sarah (Computer Science Student):**
1. Registers as STUDENT, adds profile photo and LinkedIn
2. Adds skills: Python (4/5), Data Analysis (3/5), Machine Learning (2/5)
3. Creates project: "Hospital Management System" (Healthcare sector)
4. Adds certification: "Google Data Analytics Certificate"
5. Explores Healthcare dashboard → sees career path for "Clinical Data Analyst"
6. Gets Udemy recommendations for HL7 and FHIR courses
7. Requests verification from professor for Python skill
8. Uses chatbot to ask: "Best projects for healthcare data analyst portfolio?"
9. Tracks progress over semester in Analytics dashboard

### 👨‍💼 Professional Workflow
```
Day 1: Register → Import LinkedIn Skills → Add Work Projects
Week 1: Add Certifications → Explore Career Pathways
Month 1: Use AI for Career Guidance → Compare Sector Readiness
Ongoing: Update with new projects, track certifications, get recommendations
```

**Example User Story - Michael (Agricultural Engineer):**
1. Registers as EMPLOYEE, completes profile with work experience
2. Adds skills: IoT Systems (5/5), Precision Agriculture (4/5), Data Science (3/5)
3. Creates projects: "Smart Irrigation System", "Crop Yield Prediction Model"
4. Adds certifications: AWS IoT Core, Certified Crop Advisor
5. Explores Agriculture dashboard → discovers career path for "AgriTech Solutions Architect"
6. Identifies skill gap in "Supply Chain Management" (0/5)
7. Gets course recommendations for agricultural supply chain
8. Uses Analytics to track transition from traditional farming to AgriTech

### 👨‍🏫 Educator Workflow
```
Day 1: Register as Educator → Setup Mentor Profile
Week 1: Review Student Skill Verification Requests
Month 1: Approve/Reject with Feedback → Track Student Progress
Ongoing: Mentor students, verify skills, provide guidance
```

**Example User Story - Dr. Patel (Healthcare Informatics Professor):**
1. Registers as EDUCATOR, sets up mentor profile
2. Lists expertise: Healthcare IT, EHR Systems, FHIR Standards
3. Makes profile available for mentorship in Healthcare sector
4. Receives skill verification requests from 15 students
5. Reviews evidence (projects, assignments, certificates)
6. Approves verified skills, rejects with constructive feedback
7. Connects with mentees, provides career guidance
8. Tracks class progress across Healthcare competency metrics

---

## ⏱️ Time Investment

### Initial Setup
- **Registration:** 2 minutes
- **Profile Setup:** 3 minutes
- **First Skill:** 2 minutes
- **First Project:** 4 minutes
- **First Certification:** 3 minutes
- **Total:** 14 minutes

### Weekly Maintenance
- **Update Skills:** 2-3 minutes
- **Add New Project:** 4-5 minutes
- **Check Recommendations:** 1-2 minutes
- **Total:** 7-10 minutes/week

### Deep Dive Session
- **Explore All Sectors:** 15 minutes
- **Get AI Recommendations:** 5 minutes
- **Use Chatbot:** 5 minutes
- **Analyze Cross-Sector Data:** 5 minutes
- **Request Verifications:** 5 minutes
- **Total:** 30-45 minutes (recommended monthly)

---

## 🎨 Navigation Guide

### Main Navigation Structure
```
Dashboard (/)
├── Healthcare (/dashboard/healthcare)
│   ├── Skills (/dashboard/healthcare/skills)
│   ├── Projects (/dashboard/healthcare/projects)
│   ├── Certifications (/dashboard/healthcare/certifications)
│   └── Assessment (/dashboard/healthcare/assessment)
├── Agriculture (/dashboard/agriculture)
│   ├── Skills (/dashboard/agriculture/skills)
│   ├── Projects (/dashboard/agriculture/projects)
│   ├── Certifications (/dashboard/agriculture/certifications)
│   └── Assessment (/dashboard/agriculture/assessment)
├── Urban (/dashboard/urban)
│   ├── Skills (/dashboard/urban/skills)
│   ├── Projects (/dashboard/urban/projects)
│   ├── Certifications (/dashboard/urban/certifications)
│   └── Assessment (/dashboard/urban/assessment)
├── Analytics (/dashboard/analytics)
│   └── AI Chatbot (bottom section)
├── Skills (/dashboard/skills)
├── Projects (/dashboard/projects)
├── Certifications (/dashboard/certifications)
├── Verification (/dashboard/verification)
└── Profile (/dashboard/profile)
```

### Breadcrumb Navigation
All sector-specific pages include:
- "Back to Dashboard" - Returns to main dashboard
- "Back to [Sector]" - Returns to sector homepage

---

## 💡 Pro Tips

### Maximizing Your Profile
1. **Complete Profile First:** Upload avatar, add bio, link social profiles
2. **Start with Core Skills:** Add 5-10 fundamental skills before niche ones
3. **Showcase Best Projects:** Make impactful projects public, keep experiments private
4. **Keep Certifications Current:** Update expiry dates, mark expired ones
5. **Use Tags Effectively:** Add relevant tags to skills for better discoverability

### Getting Better Recommendations
1. **Be Honest with Proficiency:** Accurate levels = better recommendations
2. **Add Project Details:** More context = more relevant course suggestions
3. **Cross-Reference Sectors:** Skills in multiple sectors show versatility
4. **Update Regularly:** AI learns from your progress over time
5. **Use Chatbot Frequently:** Access it from Analytics page - more interaction = better personalized guidance

### Building a Strong Portfolio
1. **Document Everything:** Even small projects matter
2. **Show Impact:** Quantify outcomes (e.g., "Reduced processing time by 30%")
3. **Link to Code:** Always add GitHub repos when possible
4. **Request Verification Early:** Verified skills carry more weight
5. **Diversify Sectors:** Show adaptability across Healthcare, Agriculture, Urban

### Effective Skill Verification
1. **Provide Evidence:** Attach project links, certificates, code samples
2. **Choose Right Verifiers:** Pick educators/mentors familiar with your work
3. **Add Context:** Explain how you used the skill in real scenarios
4. **Follow Up:** Politely remind verifiers after 3-5 days
5. **Accept Feedback:** Use rejection feedback to improve

---

## 🚨 Common Mistakes to Avoid

1. **Overestimating Proficiency:** Be realistic - 5/5 means expert-level mastery
2. **Incomplete Projects:** Fill all fields for better AI recommendations
3. **Ignoring Assessments:** Regular assessments show growth over time
4. **Not Exploring All Sectors:** You might discover unexpected career paths
5. **Skipping Chatbot:** It's on the Analytics page - your personal career advisor, use it!
6. **Private Everything:** Make some projects public for networking
7. **Forgetting Updates:** Stale profiles don't get good recommendations
8. **Not Tracking Progress:** Use Analytics regularly to see improvements

---

## 📊 Understanding Your Metrics

### Proficiency Levels (1-5)
- **1 (Beginner):** Basic understanding, learning fundamentals
- **2 (Developing):** Can apply concepts with guidance
- **3 (Competent):** Independent application, some experience
- **4 (Proficient):** Advanced skills, can mentor others
- **5 (Expert):** Mastery level, recognized authority

### Sector Readiness Scores
- **0-30%:** Just starting, focus on foundational skills
- **31-60%:** Building competency, add projects and certifications
- **61-80%:** Strong foundation, ready for entry-level roles
- **81-100%:** Highly competitive, ready for advanced positions

### Competency Scores
- Calculated from: Skills (50%), Projects (30%), Certifications (20%)
- Updated in real-time as you add content
- Sector-specific scoring based on industry requirements

---

## 🤔 Frequently Asked Questions

### General
**Q: Can I use SkillXIntell for free?**
A: Yes, all features are currently free during development phase.

**Q: Is my data private?**
A: Projects can be marked private. Skills and certifications are visible to educators for verification purposes.

**Q: Can I export my data?**
A: Export feature coming soon in Analytics dashboard.

### Skills
**Q: How many skills should I add?**
A: Start with 5-10 core skills, expand as you learn more. Quality over quantity.

**Q: Can I edit skill proficiency later?**
A: Yes, click on any skill and update proficiency as you improve.

**Q: What if my skill isn't listed?**
A: You can add any custom skill name - the system is flexible.

### Projects
**Q: Should I add class assignments?**
A: Yes! Any work demonstrating skills is valuable.

**Q: What's the difference between public and private projects?**
A: Public projects are visible to mentors and potential employers. Private are for personal tracking only.

**Q: Can I add team projects?**
A: Absolutely - specify team size and your role.

### Certifications
**Q: Do certifications need to be verified?**
A: No, but adding credential IDs increases credibility.

**Q: What happens when certifications expire?**
A: They're automatically marked EXPIRED but remain in your history.

### AI & Recommendations
**Q: How does AI choose recommendations?**
A: Based on your skill gaps, sector focus, proficiency levels, and career pathways.

**Q: Where is the AI chatbot located?**
A: The chatbot is located at the bottom of the Analytics page (/dashboard/analytics).

**Q: Can I trust the chatbot advice?**
A: Chatbot provides general guidance. Always verify with mentors and official sources.

**Q: Why aren't I getting recommendations?**
A: Add at least 3 skills and 1 project to activate AI recommendations.

---

## 📞 Need Help?

- **Technical Issues:** Check [Troubleshooting Guide](README.md#-troubleshooting) in main README
- **Feature Requests:** Open issue on [GitHub](https://github.com/NikzRN01/SkillXIntell/issues)
- **Questions:** Use the in-app chatbot or contact project maintainers

---

**Happy Skilling! 🚀**
