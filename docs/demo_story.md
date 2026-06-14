# Amazon LifeGraph: Hackathon Demo Flow

**Target Duration:** 5 minutes
**Presenter Objective:** Wow the judges by demonstrating the transition from a traditional "transactional" cart to a proactive "outcome-oriented" mission engine.

---

### Introduction (0:00 - 1:00)

**Presenter:**
"Hello judges. Welcome to Amazon LifeGraph. Today, e-commerce is entirely transactional. Amazon knows you're buying a tent and a flashlight, but it doesn't know *why*. It doesn't know your *outcome*. What if Amazon knew you were going camping, and could actively guarantee that your camping trip wouldn't be ruined? We built a suite of AI engines that transitions e-commerce into 'Outcome Intelligence'."

### Phase 1: User Goal & Mission Detection (1:00 - 1:45)

**Presenter:**
*(Screen shows the frontend / mocked LLM terminal)*
"Our user, Sarah, types: *'I'm going on a road trip across the country this weekend.'*
Instead of just searching for car accessories, our **Mission Detection Gateway** intercepts this and spins up an official `MISSION_ROADTRIP`. The **Commerce Knowledge Graph** instantly populates the mission requirements: Snacks, Jumper Cables, a First Aid Kit, and a Spare Tire."

*(Shows Swagger UI fetching Mission Requirements)*

### Phase 2: Verification & Risk Analysis (1:45 - 2:45)

**Presenter:**
"Sarah adds Snacks and Jumper Cables to her cart. She clicks 'Proceed to Checkout'. Normally, Amazon takes her money. But LifeGraph intercepts the checkout request."

*(Executes `POST /verification/verify` in Swagger)*
"Our **Verification Engine** compares her active cart against the mission requirements. It detects she's missing the First Aid Kit and Spare Tire. Her verification score drops to 50%."

*(Executes `POST /risk/analyze` in Swagger)*
"This triggers the **Decision Risk Engine**. Missing snacks is low risk. But the Knowledge Graph knows that missing a Spare Tire on a Road Trip creates a critical dependency failure. The Risk Score spikes to HIGH."

### Phase 3: Regret Prevention (2:45 - 3:30)

**Presenter:**
"We know she will regret this purchase if she gets a flat tire in the desert. We invoke the **Regret Prevention Engine**."

*(Executes `POST /prevent-checkout` in Swagger)*
"The engine actively blocks the checkout. It intercepts the UI, showing Sarah: *'Wait! Your Road Trip mission is at risk. You forgot a Spare Tire and a First Aid Kit. Add these with 1-Click to guarantee mission success.'* We've just saved Sarah's weekend."

### Phase 4: Memory Layer & Outcome Simulator (3:30 - 4:30)

**Presenter:**
"But LifeGraph gets smarter over time. Let's look at the **Commerce Memory Layer**."
*(Shows `GET /adaptive/profile`)*

"LifeGraph remembers that Sarah previously failed a 'Camping' mission because she forgot bug spray. Because of her history of forgetting critical items, the **Adaptive Decision Engine** has placed Sarah in *Strict Mode*.

Before she even starts her next mission, the **Outcome Simulator** runs in the background."
*(Executes `POST /simulator/run`)*
"It predicts she only has a 40% probability of success for this road trip unless she accepts our recommendations. By leveraging memory, adaptive rules, and real-time simulation, Amazon becomes a proactive partner in her life outcomes."

### Conclusion (4:30 - 5:00)

**Presenter:**
"In conclusion, LifeGraph is not a feature—it is a fundamental architecture shift. By wiring together Verification, Risk, Prevention, and Simulator engines backed by a Knowledge Graph, we guarantee outcomes, prevent regret, and build unprecedented trust. Thank you."
