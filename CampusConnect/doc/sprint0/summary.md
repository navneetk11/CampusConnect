# SUMMARY

## Project Objectives

The primary objective of our team is to develop a centralized campus study platform tailored specifically for York University students. Large departments and high-enrollment courses often make it difficult for students to form meaningful academic connections, particularly in first year. Many students attend lectures without forming study partnerships, which can lead to academic isolation, reduced motivation, and lower academic engagement.

This platform aims to reduce academic isolation by providing a structured, reliable, and accessible way for students to create, discover, and participate in study groups. The system will centralize academic collaboration and replace fragmented methods such as social media posts, informal messaging groups, or word-of-mouth coordination.

Our goals are to:

- Enable students to easily find peers enrolled in the same course or program  
- Provide structured tools for organizing recurring study sessions  
- Offer clear filtering and categorization by course, department, and study format (virtual or in-person)  
- Support communication and resource sharing within groups  
- Create a scalable foundation that can expand across multiple development sprints  

Currently, students rely on scattered platforms such as messaging apps, social media posts, or class forums to find study partners. These solutions lack structure, visibility, and dedicated academic organization. There is no centralized system that allows students to efficiently search for peers enrolled in the same course and coordinate study sessions in a structured way.

As a result:

- Students struggle to locate relevant study groups  
- Scheduling conflicts are common  
- Communication is fragmented  
- Academic isolation increases  

---

## Key Users

### First-Year Students
New students who are unfamiliar with campus networks and seek structured ways to build academic connections.

### Commuter Students
Students who travel to campus and must find study groups that fit strictly within limited on-campus hours or prefer virtual sessions.

### Upper-Year Students
Students enrolled in advanced courses who require focused, course-specific collaboration for exams and major assignments.

### Study Group Organizers
Students who create and manage study groups, schedule sessions, and moderate participation.

---

## Key Use Cases

The system will support the following primary use cases:

- A student creates an account and selects enrolled courses  
- A student searches for study groups by course, program, or study format  
- A student joins an existing study group  
- A student creates a new study group  
- A group organizer schedules study sessions  
- Members view sessions in a calendar interface  
- Group members communicate and share files  

These use cases define the core functionality of the system and guide feature prioritization across sprints.

---

## Scenarios

### Scenario 1: Joining a Study Group
A first-year Computer Science student enrolled in EECS 3311 logs into the platform and selects their enrolled courses. The system displays available study groups for EECS 3311, filtered by in-person and virtual options. The student reviews group descriptions and submits a request to join a compatible group. Once approved, the student gains access to the group’s upcoming sessions and communication space.

### Scenario 2: Creating and Managing a Study Group
An upper-year student preparing for midterms creates a new study group for a specific course. The student selects the course, sets the study format (virtual), and writes a description outlining goals and expectations. The organizer schedules recurring weekly sessions, which automatically appear in members’ calendar views. The organizer approves join requests and moderates group communication.

### Scenario 3: Scheduling and Coordination
A group member receives a notification that a study session has been scheduled for Friday at 5 PM. The session appears in their calendar view. Members use the group messaging space to coordinate topics and upload relevant notes before the session.

---

## Principles

The design of the platform is guided by several core principles:

### 1. Relevance
Study groups are organized primarily by course code and academic program to ensure that connections are meaningful and academically focused rather than purely social. This helps students quickly find groups that align with their specific learning needs.

### 2. Simplicity
The platform is designed to be intuitive and easy to navigate, particularly for first-year students who may be unfamiliar with university systems. Core actions such as searching for groups, joining sessions, and viewing schedules are kept straightforward.

### 3. Accessibility
The system supports both virtual and in-person study formats to accommodate commuter students and those with varying schedules or location constraints.

### 4. Structured Organization
Groups, sessions, and resources are clearly categorized by course, program, and study format. This structure reduces clutter and improves discoverability across the platform.

### 5. Privacy and Responsibility
Only approved group members can access group discussions, schedules, and shared materials. Group organizers are given moderation tools to manage participation responsibly.
