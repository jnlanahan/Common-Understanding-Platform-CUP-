# Product Requirements Document (PRD)

## Product Name

**Common Understanding Platform (CUP)**

## Executive Summary

The Common Understanding Platform (CUP) is an Operational Context Management platform designed to help Army staffs maintain a shared understanding of the operational environment across planning, execution, and assessment.

The platform continuously integrates staff assessments, operational assumptions, constraints, dependencies, and emerging conditions into a living operational context model. Rather than generating plans, CUP ensures commanders and staffs always understand whether their current plans remain valid as conditions change.

The product addresses a fundamental gap in military command and control systems: while existing systems provide data about the battlefield, no system continuously maintains and evaluates the staff's collective understanding of what that data means.

CUP transforms running estimates from static staff products into a living operational context layer that supports decision-making, synchronization, and adaptation during operations.

---

## Vision

Create the system that continuously answers a commander's most important question:

> "Given everything that has changed, what does it mean for the operation?"

The vision is not to replace commanders, planners, or staffs.

The vision is to provide a continuously updated representation of the staff's collective understanding of the operation so that commanders can make better decisions faster.

---

## Problem Statement

### The Nature of Military Planning

Military planning is fundamentally a process of making decisions under uncertainty.

Commanders develop plans based on:

- Known facts
- Assumptions
- Available resources
- Expected enemy behavior
- Environmental conditions
- Operational constraints

At the moment a plan is approved, it reflects the staff's best understanding of reality.

However, reality immediately begins changing.

Enemy actions change. Friendly unit locations change. Supply consumption changes. Weather changes. Communications change. Casualties occur. Higher headquarters issues new guidance.

As these changes accumulate, the assumptions and conditions that supported the original plan become increasingly outdated.

The challenge is not creating plans. The challenge is maintaining alignment between plans and reality.

---

### Current State

Army staffs maintain running estimates across all warfighting functions.

These running estimates are intended to capture:

- Current conditions
- Assumptions
- Risks
- Opportunities
- Recommendations
- Assessments

In practice, running estimates often become:

- PowerPoint slides
- Briefing products
- Spreadsheet trackers
- Fragmented documents
- Individual knowledge held by staff officers

Information exists. Understanding exists. But understanding is fragmented.

Each staff section maintains its own mental model.

Synchronization occurs through:

- Battle rhythm events
- Working groups
- Update briefs
- Planning sessions
- Informal conversations

This process is manpower intensive and difficult to sustain in dynamic operational environments.

---

### Core Problem

The Army has systems that answer: **"What is happening?"**

The Army lacks systems that answer: **"What does this mean?"**

Examples:

- A logistics system reports fuel levels.
- An intelligence system reports enemy activity.
- A communications system reports network status.
- A common operating picture displays unit locations.

None of these systems determine:

- Which assumptions are no longer valid
- Which plans are becoming infeasible
- Which decisions require commander attention
- Which staff assessments are in conflict
- Which operational risks are increasing

Human staffs perform this analysis manually.

The larger the organization becomes, the more difficult this synchronization becomes. This challenge becomes especially severe at brigade, division, corps, and theater levels.

---

## Product Thesis

Operational success depends on maintaining a shared understanding of reality.

The purpose of CUP is to create and maintain that shared understanding.

CUP serves as the operational context layer connecting:

- Current operations
- Future operations
- Plans
- Intelligence
- Sustainment
- Protection
- Fires
- Communications
- Engineering
- Command decisions

The platform does not replace military planning. The platform continuously evaluates whether planning assumptions remain true.

---

## Users

### Primary Users

**Battalion**

- Commander
- Executive Officer
- S3
- S2
- S4
- Battle Captain

**Brigade**

- Commander
- Deputy Commander
- Executive Officer
- S3
- S5
- Staff Primaries

**Division and Above**

- Chief of Staff
- G3
- G35
- G5
- Current Operations Cell
- Future Operations Cell
- Plans Cell
- Staff Principals

---

## Desired Outcomes

### Commander Outcomes

- Reduce time spent understanding changes.
- Increase time spent making decisions.
- Provide confidence that critical assumptions remain valid.
- Identify emerging operational risks before they become operational failures.
- Maintain awareness of staff disagreements and unresolved issues.

### Staff Outcomes

- Reduce effort spent manually synchronizing information.
- Reduce briefing preparation workload.
- Reduce duplicate analysis.
- Improve cross-functional awareness.
- Improve transition between current operations, future operations, and planning.

### Organizational Outcomes

- Increase operational agility.
- Improve synchronization.
- Improve decision quality.
- Reduce planning latency.
- Improve adaptation during rapidly changing operations.
- Create institutional memory regarding assumptions, decisions, and outcomes.

---

## Product Principles

**Principle 1: AI Does Not Command** — The system never makes command decisions. The system supports command decisions. Humans remain responsible for judgment.

**Principle 2: Context Is More Valuable Than Data** — Data already exists. The problem is interpretation. The platform prioritizes operational meaning over raw information.

**Principle 3: Shared Understanding Is the Product** — The primary output is not a report. The primary output is synchronized understanding.

**Principle 4: Focus on Change** — Most information does not matter. Changes matter. The system should continuously identify what changed, why it matters, and who should care.

**Principle 5: Plans Are Hypotheses** — Every plan is based on assumptions. The system continuously evaluates those assumptions.

---

## Core Capabilities

### Living Running Estimates

Each staff section maintains a continuously updated operational estimate capturing facts, assumptions, constraints, risks, opportunities, recommendations, and information gaps.

### Assumption Management

Every operational assumption is tracked. The system records owner, source, confidence, date established, supporting evidence, and contradicting evidence. The system continuously evaluates assumption validity.

### Context Dependency Graph

The platform maps relationships between units, missions, resources, tasks, decision points, assumptions, and constraints. This creates a living representation of operational dependencies.

### Plan Health Monitoring

The system continuously evaluates feasibility, supportability, synchronization, and risk. Plans receive dynamic health assessments based on changing conditions.

### Cross-Staff Conflict Detection

The platform identifies situations where staff assessments are inconsistent. Examples: operations exceeds sustainment capability; communications coverage does not support maneuver; fires planning conflicts with intelligence assessments.

### Decision Support

The system identifies decisions approaching, decisions affected by changing conditions, and information required before decisions.

### Context Summarization

The system continuously generates commander updates, staff updates, change summaries, risk summaries, and assumption summaries.

---

## Success Metrics

### Operational Metrics

- Reduction in time required to produce updates.
- Reduction in staff synchronization workload.
- Reduction in briefing preparation effort.
- Reduction in planning cycle duration.
- Increase in identified assumption failures before execution.
- Increase in early risk detection.

### User Metrics

- Daily active staff participation.
- Percentage of staff estimates maintained continuously.
- Number of cross-functional issues identified.
- Number of commander decisions supported.

---

## Long-Term Vision

The long-term vision is to become the operational context layer for military planning and execution.

Just as enterprise organizations maintain systems of record for finance, customers, and projects, military organizations should maintain a system of record for operational understanding.

CUP becomes the continuously updated representation of the staff's collective understanding of the battlefield. The platform serves as the connective tissue between information, planning, execution, assessment, and decision-making.

Success is achieved when commanders no longer ask **"What is happening?"** because the systems already answer that.

Success is achieved when commanders can immediately understand: **"What changed, why it matters, and what decisions are required."**
