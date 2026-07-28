# TheCrypto.wiki

Crypto Wiki is your trusted source for accurate and up-to-date information on all things cryptocurrency. We are dedicated to making the complex world of digital assets accessible to everyone, regardless of their level of experience.

> In the rapidly evolving world of cryptocurrency, staying informed isn't just an option—it's a necessity. At Crypto Wiki, we make that journey easier and more insightful.

Whether you're just beginning your crypto journey or are a seasoned enthusiast looking to stay on top of the latest developments, Crypto Wiki has you covered. Our platform offers a wide range of content, from beginner guides that explain the basics of blockchain technology to advanced insights into emerging trends and innovations in the cryptocurrency space.

## Demo

![Desktop Demo](https://oktayshakirov.com/assets/images/projects/crypto-wiki.png "Desktop Demo")

<p align="center">
  <a href="https://www.TinnitusHelp.me/"><strong>➥ Live Demo</strong></a>
</p>

<!-- installation -->

## ⚙️ Installation

After downloading the template, you have some prerequisites to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

### 🔧 Install prerequisites (once for a machine)

- **Node Installation:** [Install node js](https://nodejs.org/en/download/) [Recommended LTS version]

### 🖥️ Local setup

After successfully installing those dependencies, open this template with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDM [vs code shortcut <code>ctrl/cmd+\`</code>]

- Install dependencies

```
npm install
```

- Run locally

```
npm run dev
```

After that, it will open up a preview of the template in your default browser, watch for changes to source files, and live-reload the browser when changes are saved.

## 🏗️ Production Build

After finishing all the customization, you can create a production build by running this command.

```
npm run build
```

## 🔔 Push notifications for new content

The mobile app sends a "New Post" notification when a document appears in the
matching Firestore collection (`posts`, `exchanges`, `crypto-ogs`). **This is
automatic:** push content to `main` and
`.github/workflows/notify-new-content.yml` waits for the deployment to go live,
then syncs and notifies. Nothing needs to be run by hand.

It needs three repository secrets — `FIREBASE_PROJECT_ID`,
`FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` — under Settings → Secrets and
variables → Actions.

**Do not move the sync back into `npm run build`.** It used to live there, and
because a Vercel build finishes before the production alias is promoted,
notifications went out while the URL still returned 404 — taps in the first ~15
seconds hit a missing page. That is why the trigger is a post-deploy workflow
rather than a build step.

Two independent checks keep that from happening again. `scripts/waitForDeploy.js`
polls `public/content-index.json`, which ships *inside* the deployment, until the
live copy lists everything in the checkout — proof that production is serving
this commit. Then `scripts/syncContent.js` re-checks each individual article URL
before flagging it. Content that fails either check is skipped rather than
synced silently, so it stays eligible and still notifies exactly once on a later
run.

Content dated more than 48 hours ago syncs silently, so backfills and imports
never notify.

`npm run sync-content` runs the same sync from a checkout if you ever need to
send one by hand — a timed-out workflow can also just be re-run from the Actions
tab. If you replace this site with a different stack, keep serving
`/content-index.json` in the same shape and the deploy gate keeps working.

## License

This project is provided for viewing purposes only. All rights are reserved. No part of this project may be copied, modified, or redistributed without explicit written permission from the author.
