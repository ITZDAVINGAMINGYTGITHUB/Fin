const Database = require('better-sqlite3');

class StorageService {
  constructor(db) {
    this.db = db;
  }

  initialize() {
    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    // Create profiles table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        is_active INTEGER DEFAULT 0,
        avatar_color TEXT DEFAULT '#4FA7B8'
      )
    `);

    // Create settings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        profile_id TEXT DEFAULT 'default',
        FOREIGN KEY (profile_id) REFERENCES profiles(id)
      )
    `);

    // Create bookmarks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        parent_id TEXT,
        position INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        folder INTEGER DEFAULT 0,
        profile_id TEXT DEFAULT 'default'
      )
    `);

    // Create history table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        visit_count INTEGER DEFAULT 1,
        last_visit_time INTEGER DEFAULT (strftime('%s', 'now')),
        profile_id TEXT DEFAULT 'default'
      )
    `);

    // Create downloads table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        save_path TEXT,
        total_bytes INTEGER DEFAULT 0,
        received_bytes INTEGER DEFAULT 0,
        state TEXT DEFAULT 'pending',
        start_time INTEGER DEFAULT (strftime('%s', 'now')),
        end_time INTEGER,
        profile_id TEXT DEFAULT 'default'
      )
    `);

    // Create reading_list table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reading_list (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail TEXT,
        saved_at INTEGER DEFAULT (strftime('%s', 'now')),
        read_at INTEGER,
        is_read INTEGER DEFAULT 0,
        profile_id TEXT DEFAULT 'default'
      )
    `);

    // Insert default profile if not exists
    const defaultProfile = this.db.prepare('SELECT * FROM profiles WHERE id = ?').get('default');
    if (!defaultProfile) {
      this.db.prepare(`
        INSERT INTO profiles (id, name, is_active) VALUES (?, ?, ?)
      `).run('default', 'Default', 1);
    }

    // Insert default settings
    const defaultSettings = [
      ['theme', 'deep-sea'],
      ['sidebar_visible', 'true'],
      ['bookmark_bar_visible', 'false'],
      ['search_engine', 'google'],
      ['homepage', 'fin://home'],
      ['suspend_tabs_after', '1800'], // 30 minutes
      ['animations_enabled', 'true'],
      ['fin_personality', 'subtle'],
    ];

    const insertSetting = this.db.prepare(`
      INSERT OR IGNORE INTO settings (key, value, profile_id) VALUES (?, ?, ?)
    `);

    for (const [key, value] of defaultSettings) {
      insertSetting.run(key, value, 'default');
    }
  }

  // Profile methods
  getProfiles() {
    return this.db.prepare('SELECT * FROM profiles ORDER BY created_at').all();
  }

  createProfile(name) {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO profiles (id, name) VALUES (?, ?)
    `).run(id, name);
    return { id, name };
  }

  deleteProfile(profileId) {
    if (profileId === 'default') {
      return { success: false, error: 'Cannot delete default profile' };
    }
    this.db.prepare('DELETE FROM profiles WHERE id = ?').run(profileId);
    return { success: true };
  }

  setActiveProfile(profileId) {
    this.db.exec('UPDATE profiles SET is_active = 0');
    this.db.prepare('UPDATE profiles SET is_active = 1 WHERE id = ?').run(profileId);
  }

  // Settings methods
  getSettings(profileId = 'default') {
    const rows = this.db.prepare('SELECT * FROM settings WHERE profile_id = ?').all(profileId);
    const settings = {};
    for (const row of rows) {
      settings[row.key] = JSON.parse(row.value);
    }
    return settings;
  }

  saveSettings(settings, profileId = 'default') {
    const upsert = this.db.prepare(`
      INSERT OR REPLACE INTO settings (key, value, profile_id) VALUES (?, ?, ?)
    `);
    for (const [key, value] of Object.entries(settings)) {
      upsert.run(key, JSON.stringify(value), profileId);
    }
    return { success: true };
  }

  getSetting(key, profileId = 'default') {
    const row = this.db.prepare('SELECT * FROM settings WHERE key = ? AND profile_id = ?').get(key, profileId);
    return row ? JSON.parse(row.value) : null;
  }

  // Bookmark methods
  getBookmarks(profileId = 'default') {
    return this.db.prepare('SELECT * FROM bookmarks WHERE profile_id = ? ORDER BY position').all(profileId);
  }

  addBookmark(bookmark, profileId = 'default') {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO bookmarks (id, title, url, parent_id, position, folder, profile_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, bookmark.title, bookmark.url, bookmark.parentId || null, bookmark.position || 0, bookmark.folder ? 1 : 0, profileId);
    return { id, ...bookmark };
  }

  updateBookmark(id, bookmark) {
    this.db.prepare(`
      UPDATE bookmarks SET title = ?, url = ?, parent_id = ?, position = ?, updated_at = strftime('%s', 'now')
      WHERE id = ?
    `).run(bookmark.title, bookmark.url, bookmark.parentId, bookmark.position, id);
    return { success: true };
  }

  deleteBookmark(id) {
    this.db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
    return { success: true };
  }

  // History methods
  getHistory(limit = 100, profileId = 'default') {
    return this.db.prepare(`
      SELECT * FROM history WHERE profile_id = ? 
      ORDER BY last_visit_time DESC LIMIT ?
    `).all(profileId, limit);
  }

  addHistoryItem(item, profileId = 'default') {
    const { v4: uuidv4 } = require('uuid');
    const existing = this.db.prepare('SELECT * FROM history WHERE url = ? AND profile_id = ?').get(item.url, profileId);
    
    if (existing) {
      this.db.prepare(`
        UPDATE history SET visit_count = visit_count + 1, title = ?, last_visit_time = strftime('%s', 'now')
        WHERE id = ?
      `).run(item.title, existing.id);
      return existing;
    } else {
      const id = uuidv4();
      this.db.prepare(`
        INSERT INTO history (id, url, title, profile_id) VALUES (?, ?, ?, ?)
      `).run(id, item.url, item.title, profileId);
      return { id, ...item };
    }
  }

  clearHistory(profileId = 'default') {
    this.db.prepare('DELETE FROM history WHERE profile_id = ?').run(profileId);
    return { success: true };
  }

  searchHistory(query, profileId = 'default') {
    return this.db.prepare(`
      SELECT * FROM history WHERE profile_id = ? AND (title LIKE ? OR url LIKE ?)
      ORDER BY last_visit_time DESC LIMIT 50
    `).all(profileId, `%${query}%`, `%${query}%`);
  }

  // Download methods
  getDownloads(profileId = 'default') {
    return this.db.prepare('SELECT * FROM downloads WHERE profile_id = ? ORDER BY start_time DESC').all(profileId);
  }

  addDownload(download, profileId = 'default') {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO downloads (id, filename, url, save_path, total_bytes, state, profile_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, download.filename, download.url, download.savePath || null, download.totalBytes || 0, download.state || 'pending', profileId);
    return { id, ...download };
  }

  updateDownload(id, update) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(update)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);
    this.db.prepare(`UPDATE downloads SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return { success: true };
  }

  removeDownload(id) {
    this.db.prepare('DELETE FROM downloads WHERE id = ?').run(id);
    return { success: true };
  }

  // Reading list methods
  getReadingList(profileId = 'default') {
    return this.db.prepare('SELECT * FROM reading_list WHERE profile_id = ? ORDER BY saved_at DESC').all(profileId);
  }

  addToReadingList(item, profileId = 'default') {
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    this.db.prepare(`
      INSERT INTO reading_list (id, title, url, thumbnail, profile_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, item.title, item.url, item.thumbnail || null, profileId);
    return { id, ...item };
  }

  markAsRead(id) {
    this.db.prepare(`
      UPDATE reading_list SET is_read = 1, read_at = strftime('%s', 'now') WHERE id = ?
    `).run(id);
    return { success: true };
  }

  removeFromReadingList(id) {
    this.db.prepare('DELETE FROM reading_list WHERE id = ?').run(id);
    return { success: true };
  }
}

module.exports = StorageService;
