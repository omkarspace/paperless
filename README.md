
# paperless (Notekeeper App)

A modern note-taking application built with React and Firebase, featuring real-time updates and a responsive masonry layout.

## Features

- Create, edit, and delete notes
- Real-time data synchronization with Firebase
- Responsive masonry layout
- Auto-resizing text areas
- Toast notifications
- Modern UI with Tailwind CSS
- HMR support

## Tech Stack

- React 18
- Vite
- Firebase
- Tailwind CSS
- HeadlessUI
- HeroIcons
- React Hot Toast
- React Masonry CSS
- React Textarea Autosize

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Firebase account and project setup

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd notekeeper-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase configuration file at `src/firebase.js` with your credentials.

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run preview` - Previews the production build
- `npm run lint` - Runs ESLint

## Project Structure

```
notekeeper-app/
├── src/
│   ├── hooks/
│   │   └── useNotes.js
│   ├── components/
│   ├── firebase.js
│   └── main.jsx
├── public/
├── index.html
├── tailwind.config.js
├── package.json
└── vite.config.js
```

## Styling

The project uses Tailwind CSS for styling with custom configurations:
- Custom scale transformations
- Form plugin integration
- Responsive design support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Vite for the blazing fast development experience
- Firebase for the backend services
- Tailwind CSS for the utility-first styling
```

This README provides a comprehensive overview of your project, including setup instructions, available scripts, project structure, and contribution guidelines. It follows modern README conventions and includes all the essential information developers would need to understand and work with your project.
