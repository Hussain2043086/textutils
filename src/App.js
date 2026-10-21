
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const getSavedNotes = () => {
  try {
    const saved = localStorage.getItem("textutils-notes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function App() {
  const [text, setText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [notes, setNotes] = useState(getSavedNotes);
  const [noteSearch, setNoteSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("textutils-notes", JSON.stringify(notes));
  }, [notes]);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [text]);

  const characterCount = text.length;
  const sentenceCount = text.trim()
    ? text.split(/[.!?]+/).filter((sentence) => sentence.trim()).length
    : 0;
  const readingTime = Math.ceil(wordCount / 200);

  const showMessage = (value) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2200);
  };

  const handleUppercase = () => {
    setText((current) => current.toUpperCase());
  };

  const handleLowercase = () => {
    setText((current) => current.toLowerCase());
  };

  const handleCapitalize = () => {
    setText((current) =>
      current.replace(/\b\w/g, (character) => character.toUpperCase())
    );
  };

  const handleRemoveExtraSpaces = () => {
    setText((current) => current.trim().replace(/\s+/g, " "));
  };

  const handleCopy = async () => {
    if (!text) {
      showMessage("Pehle kuch text likho!");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showMessage("Text copied successfully!");
    } catch {
      showMessage("Copy nahi ho paya. Browser permission check karo.");
    }
  };

  const handleClear = () => {
    setText("");
    setNoteTitle("");
    setEditingNoteId(null);
    showMessage("Text cleared!");
  };

  const handleSaveNote = () => {
    const trimmedText = text.trim();
    const trimmedTitle = noteTitle.trim();

    if (!trimmedText) {
      showMessage("Save karne ke liye pehle text likho!");
      return;
    }

    const now = new Date().toISOString();

    if (editingNoteId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingNoteId
            ? {
                ...note,
                title: trimmedTitle || "Untitled Note",
                content: trimmedText,
                updatedAt: now,
              }
            : note
        )
      );
      showMessage("Note updated successfully!");
    } else {
      const newNote = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: trimmedTitle || "Untitled Note",
        content: trimmedText,
        createdAt: now,
        updatedAt: now,
      };

      setNotes((currentNotes) => [newNote, ...currentNotes]);
      showMessage("Note saved successfully!");
    }

    setNoteTitle("");
    setText("");
    setEditingNoteId(null);
  };

  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setText(note.content);
    setEditingNoteId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("Note editing mode enabled.");
  };

  const handleDeleteNote = (id) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    if (editingNoteId === id) {
      setEditingNoteId(null);
      setNoteTitle("");
      setText("");
    }

    showMessage("Note deleted.");
  };

  const handleCopyNote = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      showMessage("Note copied!");
    } catch {
      showMessage("Copy nahi ho paya.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const search = noteSearch.toLowerCase();
    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateValue) => {
    if (!dateValue) return "Recently saved";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Recently saved";

    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className={`App ${darkMode ? "dark" : ""}`}>
      <nav className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✦</span>
          TextUtils <span className="brand-pro">Pro</span>
        </a>

        <div className="nav-actions">
          <a className="nav-link" href="#home">
            Home
          </a>
          <a className="nav-link" href="#notes">
            My Notes
          </a>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      <main id="home" className="main-content">
        <header className="hero">
          <span className="hero-badge">YOUR SMART TEXT WORKSPACE</span>
          <h1>
            Make Your Text <span>Powerful.</span>
          </h1>
          <p>
            Write, transform, analyze, and save your text — all in one place.
          </p>
        </header>

        <section className="editor-card" aria-labelledby="editor-heading">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TEXT EDITOR</span>
              <h2 id="editor-heading">Start writing</h2>
            </div>
            <span className="live-indicator">
              <span className="live-dot"></span> Ready to use
            </span>
          </div>

          <label className="field-label" htmlFor="note-title">
            Note title <span>(optional)</span>
          </label>

          <input
            id="note-title"
            className="note-title-input"
            type="text"
            placeholder="Give your note a title..."
            value={noteTitle}
            onChange={(event) => setNoteTitle(event.target.value)}
            maxLength={100}
          />

          <label className="field-label" htmlFor="text-editor">
            Your text
          </label>

          <textarea
            id="text-editor"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste your text here..."
            rows={9}
            spellCheck="true"
          />

          <div className="editor-meta">
            <span>{wordCount} words</span>
            <span>{characterCount} characters</span>
          </div>

          <div className="toolbar">
            <button type="button" onClick={handleUppercase}>
              AA Uppercase
            </button>
            <button type="button" onClick={handleLowercase}>
              aa Lowercase
            </button>
            <button type="button" onClick={handleCapitalize}>
              Aa Capitalize
            </button>
            <button type="button" onClick={handleRemoveExtraSpaces}>
              ↔ Fix spaces
            </button>
          </div>

          <div className="note-actions">
            <button
              type="button"
              className="save-note-btn"
              onClick={handleSaveNote}
            >
              {editingNoteId !== null ? "✓ Update Note" : "＋ Save Note"}
            </button>

            <button
              type="button"
              className="new-note-btn"
              onClick={handleCopy}
            >
              ▢ Copy Text
            </button>

            <button
              type="button"
              className="new-note-btn"
              onClick={handleClear}
            >
              ✕ Clear
            </button>
          </div>
        </section>

        <section className="stats" aria-label="Text statistics">
          <div className="stat">
            <span className="stat-icon">📝</span>
            <span className="stat-value">{wordCount}</span>
            <span className="stat-label">Words</span>
          </div>

          <div className="stat">
            <span className="stat-icon">🔤</span>
            <span className="stat-value">{characterCount}</span>
            <span className="stat-label">Characters</span>
          </div>

          <div className="stat">
            <span className="stat-icon">📖</span>
            <span className="stat-value">{sentenceCount}</span>
            <span className="stat-label">Sentences</span>
          </div>

          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">{readingTime} min</span>
            <span className="stat-label">Reading time</span>
          </div>
        </section>

        <section id="notes" className="notes-section">
          <div className="notes-header">
            <div>
              <span className="eyebrow">YOUR COLLECTION</span>
              <h2 className="notes-heading">Saved Notes</h2>
              <p className="notes-subtitle">
                Keep your important thoughts in one place.
              </p>
            </div>
            <span className="notes-count">{notes.length} notes</span>
          </div>

          <input
            className="notes-search"
            type="search"
            placeholder="Search notes by title or content..."
            value={noteSearch}
            onChange={(event) => setNoteSearch(event.target.value)}
            aria-label="Search saved notes"
          />

          {filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <article className="note-card" key={note.id}>
                  <div className="note-card-top">
                    <h3>{note.title}</h3>
                    <span className="note-date">
                      {formatDate(note.updatedAt || note.createdAt)}
                    </span>
                  </div>

                  <p className="note-preview">{note.content}</p>

                  <div className="note-card-actions">
                    <button
                      type="button"
                      onClick={() => handleEditNote(note)}
                      aria-label={`Edit ${note.title}`}
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyNote(note.content)}
                      aria-label={`Copy ${note.title}`}
                    >
                      ▢ Copy
                    </button>

                    <button
                      type="button"
                      className="delete-note-btn"
                      onClick={() => handleDeleteNote(note.id)}
                      aria-label={`Delete ${note.title}`}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-notes">
              <div className="empty-icon">
                {noteSearch ? "⌕" : "✎"}
              </div>
              <h3>{noteSearch ? "No matching notes" : "No notes yet"}</h3>
              <p>
                {noteSearch
                  ? "Try another search term."
                  : "Write something above and save it to see your notes here."}
              </p>
            </div>
          )}
        </section>

        <section className="tips-section">
          <span className="tips-icon">💡</span>
          <div>
            <h3>Quick tip</h3>
            <p>
              Your notes are saved in this browser on this device using local
              storage. Export or copy important notes before clearing browser
              data.
            </p>
          </div>
        </section>

        <footer className="app-footer">
          <p>Made for better writing. ✨</p>
          <span>TextUtils Pro · Your personal text workspace</span>
        </footer>
      </main>

      {message && (
        <div className="toast-message" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}

export default App;
