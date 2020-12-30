# [My Code Docs](https://markmccoid.github.io/myCodeDocs)

This repository is using the [docusaurus.io](https://docusaurus.io/) package to create a site with my various notes on programming, projects, etc that I have come across over the years.

It is my go to place when I need to "remember" how to do something like bootstrap an Electron JS project.

Fun thing about technology is that it changes...FAST!  Even so, I have found this a great way to cement my knowledge and give me a head start when looking for information.

Keep in mind, these notes were written for me and not ever intended for others, thus they are not polished and may not be as helpful to others as they are to me.  With that said, anyone is welcome to peruse and enhance whatever they find useful within this repo!

## Pushing to Github Pages

Docusaurus makes is super easy to deploy your site to GitHub Pages.

1. Commit changes in root

2. Change to `website` directory and run `yarn build`

3. If not on a mac, open git bash and run 

   ```bash
   GIT_USER=markmccoid CURRENT_BRANCH=master USE_SSH=true npm run publish-gh-pages
   ```