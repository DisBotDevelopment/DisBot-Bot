# Contributing

## TL;DR
Hey, glad you're here!  
Want to contribute your knowledge to DisBot? Awesome! No one is perfect, and everyone has something to contribute. Please be respectful and fair when giving suggestions – everyone has their area of expertise.

## Rules

> **Code Rules**  
- No unnecessary code  
- Prioritize functionality and readability  
- Follow good coding practices (stick to the existing bot structure)  
- Always keep security and features in mind  

> **Repository Rules**  
- Use branches for new features or modules  
- Name your branches logically and consistently  

### Branch Naming Examples
- `update/<module-name>` – For updates to existing modules or features  
- `module/<module-name>` – For new modules or features  

## Repository Structure

The DisBot repo follows a clear structure:  
Every few months, a new feature is released in its own branch. Upon release, a corresponding GitHub tag is created and a Docker image is published.

**Important:**  
Always work on the branch currently marked as `main` (latest). New features should be developed in their own feature branches and then merged into `main`. The `main` branch also contains hotfixes for bugs.

## How to Fork

> Now it's your turn! Start your feature.

1. Fork the repository and select only the `main` branch for the fork.  
2. Create a new branch with a fitting name, e.g., `module/<module-name>`.  
3. Develop your module or feature.  
4. Open a pull request so I (or we) can review your code and integrate your feature into DisBot.

Thank you for contributing! 🚀
