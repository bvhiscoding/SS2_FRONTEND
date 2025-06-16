# Blockchain-Based Voting System: A Secure and Transparent Electoral Solution
## Overview
Blockchain-Based Voting System is a secure and transparent digital platform designed to revolutionize the electoral process by leveraging blockchain technology. The application addresses the limitations of traditional paper-based voting systems (resource waste, logistical challenges, security concerns) and improves upon conventional e-voting systems by implementing an immutable, decentralized ledger that ensures vote integrity and prevents manipulation. Built with Angular JS for the frontend and ASP.NET Core for the backend, the system operates on the Polygon network to provide high throughput and cost-effective transactions while maintaining environmental efficiency.

The platform features comprehensive user authentication with multi-factor verification, secure voter registration, blockchain-based ballot creation, anonymous yet verifiable vote casting, real-time vote tracking, transparent counting mechanisms, and an intuitive analytics dashboard. By combining cryptographic security with blockchain's inherent transparency, our solution aims to increase electoral trust, reduce administrative costs, and enhance accessibility while maintaining the highest standards of vote privacy and system integrity. The system enables organizations to conduct secure elections where results can be independently verified without compromising voter anonymity, ultimately strengthening democratic processes through technological innovation.


## Table of Contents
1. [Overview](https://github.com/bvhiscoding/SS2_FRONTEND/#overview)
2. [Technology Explanation](https://github.com/bvhiscoding/SS2_FRONTEND/#technology-explanation)
3. [Functions](https://github.com/bvhiscoding/SS2_FRONTEND/#functions)
4. [Project Structure](https://github.com/bvhiscoding/SS2_FRONTEND/#project-structure)
5. [UI UX Design](https://github.com/bvhiscoding/SS2_FRONTEND/#ui-ux-design)
6. [Conclusion](https://github.com/bvhiscoding/SS2_FRONTEND/#conclusion)

## Technology Explanation

For Front-end design, this project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.7.

Blockchain Technology in the Voting System

The voting system leverages blockchain technology through the Polygon network (formerly Matic), a layer 2 scaling solution for Ethereum that provides high throughput, low transaction fees, and environmental efficiency. This implementation delivers the core benefits of blockchain—immutability, transparency, and security—while overcoming traditional blockchain limitations related to transaction speed and cost.

![Screenshot 2025-05-01 103802](https://github.com/user-attachments/assets/48b70355-c4d0-4c03-9a57-ebef64ac42a9)

Core Blockchain Components
Distributed Ledger Architecture
- The system uses a distributed ledger where each vote is stored as a transaction across multiple nodes, eliminating single points of failure and creating a tamper-resistant record. Unlike centralized databases, this distributed architecture ensures no single entity can modify votes once cast.

Smart Contracts
The system implements Solidity-based smart contracts that govern the entire voting process:
- Ballot Creation Contracts: Define election parameters, candidate information, and voting periods
- Vote Verification Contracts: Validate voter eligibility and prevent double-voting
- Vote Counting Contracts: Automatically tally results using predefined rules
- Result Certification Contracts: Autonomously certify election outcomes when predetermined conditions are met

Cryptographic Security
The system employs advanced cryptographic techniques to:
- Secure voter identities through asymmetric encryption
- Create anonymous yet verifiable voting records
- Generate unique transaction IDs that allow voters to track their votes
- Implement zero-knowledge proofs to verify vote validity without revealing voter choices

Consensus Mechanism
The Polygon network uses a Proof of Stake (PoS) consensus mechanism, which:
- Validates transactions efficiently with minimal environmental impact
- Provides faster transaction finality compared to Proof of Work systems
- Ensures agreement across the network regarding the validity of each vote

Integration Architecture
The blockchain layer integrates with the application through:
- Web3.js Integration: Connects the Angular JS frontend directly to the Polygon blockchain
- Smart Contract Interfaces: Facilitates communication between the ASP.NET Core backend and deployed contracts
- Event Listeners: Captures and processes blockchain events for real-time updates
- Transaction Management: Handles the submission and confirmation of voting transactions

![Screenshot 2025-05-01 103918](https://github.com/user-attachments/assets/3f81b322-ed57-40e8-9ec6-47d476a26025)

Benefits of This Blockchain Implementation

- Immutable Audit Trail: Every vote creates a permanent, unchangeable record on the blockchain
- Transparency: The entire process can be independently verified without compromising voter privacy
- Elimination of Trust Requirements: The system doesn't require trusted third parties to validate results
- Resistance to Manipulation: Distributed architecture prevents vote tampering and fraud
- Real-time Verification: Voters can confirm their votes were recorded correctly
- Cost Efficiency: Polygon's low transaction fees make large-scale elections economically viable

![Screenshot 2025-05-01 104008](https://github.com/user-attachments/assets/05ec1d08-da1e-45a8-ac0f-69ac01f895fa)

## Functions
(The following list is unsorted)
- Login
- Personal Information
- User Management
- Statistic Management
- Notifications
- Voting Management
- Hierarchy Management
- Password Recovery
- Voting Function
- Account Management
- Database Management

## Project Structure
![Project_BFD_Diagram](https://github.com/user-attachments/assets/a7ff7c16-3441-481c-ad0f-aa14bfe1469e)

Figure 1. BFD Diagram of Blockchain voting application

The Block Flow Diagram illustrates the high-level architecture of the blockchain-based voting system, showcasing interaction between different components. The frontend layer provides users with an intuitive interface for voting operations, handling authentication, vote casting, and result visualization. The middleware manages business logic, user management, and communication with both database and blockchain networks.
The backend integration connects to PostgreSQL for user credentials and metadata, and Polygon blockchain for immutable vote recording. Smart contracts automatically enforce voting rules and maintain an immutable ledger. The system incorporates security measures including two-factor authentication, encrypted transmission, and role-based access control with proper segregation between administrative and voter functions.

![Project_ER_Diagram](https://github.com/user-attachments/assets/aec0b2ea-e649-4396-a9ae-f539b107531a)

Figure 2. ER Diagram of Blockchain voting application

The Entity-Relationship diagram depicts the comprehensive data model underlying the blockchain voting system. Central entities include Users, Elections, Positions, Candidates, and Votes with specific attributes and relationships. The User entity stores authentication credentials and role assignments supporting multiple user types. The Election entity contains metadata including timeframes and eligible voter lists.
The Position entity represents contested roles, with candidates linked through many-to-many relationships. The Vote entity links voters to chosen candidates, including blockchain transaction hashes for traceability. Supporting entities handle notifications, audit logs, and configuration settings enabling comprehensive election management and monitoring.

![Project_Use-case_Diagram](https://github.com/user-attachments/assets/cf5542ca-36e8-482b-a2d3-d8b6f8ada46b)

Figure 3. Use Case Diagram of Blockchain voting application

The Use Case diagram illustrates functional requirements and interactions within the system, identifying three primary actors: Voters, Election Administrators, and System Administrators. Voter use cases include authentication, viewing elections, casting votes, tracking status, and accessing results. The system ensures eligible participation and prevents multiple voting through blockchain verification.
Election Administrator use cases encompass creating elections, managing candidates, defining eligibility, monitoring progress, and generating reports. System Administrator use cases focus on user management, configuration, security monitoring, and maintenance. Cross-cutting concerns include notification management, audit logging, and security enforcement across all interactions.

## UI UX Design
Login Page

![Login](https://github.com/user-attachments/assets/600613fd-799d-495e-9d31-87acb7e63d8e)

Statistics Page

![Statistics](https://github.com/user-attachments/assets/8881c832-4f49-4d22-9339-df2df5589fe8)

User Management Page

![User Management](https://github.com/user-attachments/assets/de5d94b9-fd6f-4aa0-a10a-c1a1c2c43611)

Proceed Voting Page

![Proceed Voting](https://github.com/user-attachments/assets/0eb28383-a251-4b8a-94f1-dcaff9767c6b)

Follow Election/Voting Monitor Page

![Follow Election/Voting Monitor](https://github.com/user-attachments/assets/2305cf7a-7eb4-40e3-aab1-309993da98d0)

Voting/Election Management Page

![Voting/Election Management](https://github.com/user-attachments/assets/f213c46a-3772-43fd-b7fc-a71602e08e30)

Personal Information Page

![Personal Information](https://github.com/user-attachments/assets/a7e89646-a772-47d5-b665-8790a486cd51)

System Settings Page

Language/Region

![Language/Region](https://github.com/user-attachments/assets/91df89b5-06b0-4bc5-92b6-fa9b0b56d837)

Theme

![Theme](https://github.com/user-attachments/assets/bc3b08f5-3952-4bd1-b091-fffe995d99d4)

Notification

![Notification](https://github.com/user-attachments/assets/09435ce1-f683-4cc3-aa7f-70ea9c4c2f7f)

Security

![Security](https://github.com/user-attachments/assets/ad71b901-8833-49b1-810f-92c5aac4ab85)

## Conclusion
In this project, we have demonstrated how blockchain technology can significantly enhance the security, transparency, and integrity of electronic voting systems. Through our comprehensive analysis and system development, we believe that our blockchain-based voting solution effectively combines the advantages of digital voting with the decentralized, immutable features of blockchain technology. We have shown that our system can meet critical electoral requirements such as voter anonymity, ballot security, transparency, and auditability. By leveraging smart contracts, we automate the voting process, ensuring that rules are enforced consistently and results are trustworthy without relying on a central authority. The cryptographic techniques integrated into our system further protect against tampering, fraud, and unauthorized data manipulation.

Our key contribution lies in designing a three-phase voting model—covering preparation, voting, and result aggregation—that maintains security and transparency throughout the entire electoral cycle. We believe that this approach not only improves accessibility and reduces operational costs but also fosters greater public trust in democratic processes. Of course, we recognize that challenges remain, particularly regarding scalability, energy consumption, and system complexity. Moving forward, we think that further research should focus on optimizing blockchain consensus mechanisms, enhancing user experience, and developing regulatory frameworks to facilitate real-world deployment. Overall, we are hopeful that our work represents a meaningful step toward modernizing electoral systems while upholding the fundamental principles of democracy in the digital age.
