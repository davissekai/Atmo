# AI-Assisted Coding: Agency & Skill Acquisition Protocol

**Last Updated:** December 21, 2025  
**Author:** Davis Dey  
**Purpose:** Guidelines for building with AI without losing agency or skill acquisition

---

## CORE PRINCIPLE

**You're not trying to be a better coder than AI. You're trying to be a better builder than people who don't know how to use AI.**

AI is a tool, like a saw for a carpenter. The skill isn't "cut wood faster than the saw." The skill is:
1. **Know what to build** (problem → solution design)
2. **Know how to direct AI** (break problems into pieces AI can solve)
3. **Know when AI is wrong** (debug, validate, iterate)
4. **Know how systems fit together** (architecture, not just syntax)

---

## THE BALANCE: SPEED + SKILL

### When Agency REDUCES (Avoid This):
- Blindly accepting AI's code without understanding what it does
- Can't debug when AI gives broken code
- Don't know *why* a solution works, just that it does
- Dependent on AI for every single line (can't write anything yourself)

### When Agency INCREASES (Do This):
- Use AI to move faster on parts you understand (boilerplate, repetitive patterns)
- Learn from AI's code (read it, understand it, modify it)
- Catch AI's mistakes (because you understand the problem)
- Direct AI toward solutions you've architected (you're the designer, AI is the implementer)

**Key:** Don't treat AI like a magic box. Treat it like a **junior developer on your team** who's fast but needs direction and review.

---

## THE PROTOCOL: BUILD WITH AI, LEARN WITHOUT IT

### 1. Always Understand the Code AI Gives You
- Don't just copy-paste
- Read through it line by line
- If you don't understand something, ask AI to explain it
- Then try to rewrite that section yourself (without AI)

**Example:**
```
AI gives you a function
→ Read it, understand the logic
→ Close the AI, rewrite the function from scratch
→ Compare yours to AI's (what did you miss? what did AI do better?)
```

### 2. Start with AI, Finish Without It
- Use AI to scaffold (set up project structure, boilerplate)
- Use AI for first drafts (get something working quickly)
- Then **iterate without AI** (refactor, optimize, add features yourself)

**Example:**
```
AI helps you build a basic Flask API
→ You add error handling yourself
→ You refactor the code structure yourself
→ You add a new endpoint yourself (no AI)
```

### 3. Use AI for Speed, Not Thinking
- When you know *what* to do but typing is slow → use AI
- When you don't know *what* to do → think first, then use AI to validate

**Example:**
```
You know you need a database model for emissions data
You know the fields: factor_id, category, value, source
→ AI writes the SQLAlchemy model (saves you 5 mins of typing)
→ But YOU designed the schema. AI just typed it.
```

### 4. Force Yourself to Code Without AI Regularly
- Set aside "no AI" sessions (1-2 hours/week)
- Try to implement something you've built with AI before
- Struggle is where learning happens

**Example:**
```
You built a FastAPI endpoint with AI last week
→ This week, build a similar one without AI
→ You'll forget syntax, Google it, struggle—THAT'S GOOD
→ You're encoding the knowledge in your brain, not just in chat history
```

---

## BUILDING A NEW PROJECT: THE 3-PHASE APPROACH

### Phase 1: Build with AI (Learn the Stack)
- Use AI to scaffold the project (Flask/FastAPI + basic UI)
- Use AI to write first drafts of functions
- **But:** Read every line. Understand what it does. Ask questions when confused.

**Goal:** Get something working fast. Learn the stack (web framework, LLM API calls, frontend basics).

### Phase 2: Iterate Without AI (Internalize the Patterns)
- Pick one feature AI built
- Rewrite it from scratch without AI
- Add a new feature yourself (no AI)
- Refactor the code structure yourself

**Goal:** Prove to yourself you can build without AI. Encode the patterns in your brain.

### Phase 3: Extend Beyond the Wrapper (Add Your Own Intelligence)
- Add domain-specific logic (climate context, Ghana-specific data)
- Add error handling, edge cases, validation
- Add features AI wouldn't think of (because you understand the problem)

**Goal:** The project becomes yours. AI helped you start, but now you own it.

---

## WEEKLY PRACTICE SCHEDULE

### Structure Your Week:
- **1-2 "with AI" sessions:** Build fast, learn the stack, get things working
- **1-2 "without AI" sessions:** Rebuild something you did with AI, or add a feature yourself
- **1 "review" session:** Look at code you wrote (with or without AI) and refactor it

**Result:** You move fast (with AI) but still build skill (without AI). Agency stays intact because you're always the architect, never the passenger.

---

## STARTING A NEW FEATURE: THE STEP-BY-STEP

1. **Think first.** What are you trying to build? What's the simplest version? How would you break it into pieces?
2. **Use AI to scaffold.** Get the structure in place quickly.
3. **Read AI's code.** Understand every line. Ask questions. Google concepts you don't know.
4. **Modify it yourself.** Change something. Add something. Break something and fix it.
5. **Build the next feature without AI.** See how far you get. Use AI only when truly stuck.

---

## SKILL ACQUISITION HIERARCHY (Prioritized by ROI)

### Tier 1: Build Real Projects (Highest Leverage)
- Climate assistant wrapper
- Gaia MVP (Feb-Mar 2026)
- Maze solver (Apr-May 2026)
- Energy optimization agent (Jun-Jul 2026)

**Why:** You learn by building things that matter. The constraints are real. The problems are yours.

### Tier 2: Rewrite AI's Code Without AI (Deliberate Practice)
- After AI helps you build something, rebuild it yourself
- Try to implement the same feature a different way
- Refactor AI's code to be cleaner, more efficient

**Why:** This is where skill acquisition happens. You're encoding patterns, not just copying.

### Tier 3: Read Other People's Code (Learn Patterns)
- Find open-source projects similar to what you're building
- Read their code (how did they structure it? what patterns did they use?)
- Steal good patterns, avoid bad ones

**Why:** You learn by seeing how experienced developers solve problems.

### Tier 4: Codewars/HackerRank (Lowest Leverage)
- Only if you have extra time (you don't)
- Only if you want to practice algorithmic thinking (not needed for your ventures)
- **Skip this for now.** Revisit in 2027+ if interested.

**Why:** Abstract toy problems don't teach you systems thinking or product building—the skills you actually need.

---

## THE TWO TYPES OF DEVELOPERS WHO USE AI

### Bad Developers Who Use AI:
- Copy-paste without understanding
- Can't debug when AI is wrong
- Build fragile systems because they don't understand how pieces fit together
- Lose agency (dependent on AI for everything)

### Good Developers Who Use AI:
- Use AI for speed on things they understand
- Catch AI's mistakes because they know the problem
- Build robust systems because they understand architecture
- Retain agency (AI is a tool they control, not a crutch they need)

**You're already thinking like the second type.** The fact that you're worried about losing agency means you won't—because you're paying attention.

---

## APPLYING THIS TO YOUR CURRENT PROJECTS

### Climate Assistant Web App (Current Project)
**Phase 1 (Now):** Build with AI (get it working in 1-2 weeks)  
**Phase 2:** Rewrite one feature without AI (prove you can)  
**Phase 3:** Add one feature yourself (no AI at all)  
**Ship it.** Don't perfect it. Move to the next thing.

### LLM Learning (30 mins/day)
- **Week 1-2:** Build with AI, focus on speed
- **Week 3-4:** Rebuild without AI, focus on understanding
- **Repeat this cycle** for each phase (LLM basics → FastAPI → Maze Solver)

---

## FINAL REMINDERS

1. **AI is never going to be worse at coding than it is today.** You'll never "catch up" to its raw speed. That's fine—you're not competing with AI.

2. **The skill is knowing WHAT to build and HOW to architect it.** AI can implement. You design.

3. **Deliberate practice = the gap between "with AI" and "without AI" sessions.** That's where learning happens.

4. **You're building to ship products, not to pass coding interviews.** Real projects > toy problems.

5. **Agency stays intact when you remain the architect.** AI is your junior developer. You're the lead.

---

## THE BOTTOM LINE

**Can you build with AI and still become a good developer?**

**Yes. But only if you're deliberate.**

- Use AI to move fast
- Always understand what AI gives you
- Regularly build without AI to prove you can
- Iterate, refactor, extend beyond what AI suggests

**You're not trying to code better than AI. You're trying to build better than people who don't know how to use AI.**

---

**Document Version:** 1.0  
**Next Review:** After completing Climate Assistant project (est. early Jan 2026)