module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/chat",
        "http://localhost:3000/models",
        "http://localhost:3000/settings",
      ],
      startServerCommand: "npx serve -s dist",
      startServerReadyPattern: "Accepting connections",
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:performance": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
