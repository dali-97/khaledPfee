/**
 * Global SSE (Server-Sent Events) manager.
 *
 * Tracks every active client connection and exposes targeted and broadcast
 * helpers so any part of the application can push real-time events without
 * knowing about HTTP internals.
 *
 * Usage:
 *   import { sseManager } from '../services/sseService.js'
 *
 *   // send to one user
 *   sseManager.sendToUser(userId, 'mission:created', { ... })
 *
 *   // send to all admins
 *   sseManager.sendToRole('admin', 'mission:created', { ... })
 *
 *   // broadcast to every connected client
 *   sseManager.broadcast('system:notice', { message: 'Maintenance in 5 min' })
 */
class SSEManager {
  /** @type {Map<number, Set<{res: import('express').Response, role: string}>>} */
  #clients = new Map();

  /**
   * Register a new SSE client.
   * @param {number} userId
   * @param {string} role
   * @param {import('express').Response} res
   */
  addClient(userId, role, res) {
    if (!this.#clients.has(userId)) {
      this.#clients.set(userId, new Set());
    }
    this.#clients.get(userId).add({ res, role });
  }

  /**
   * Remove a specific response from the client registry (on disconnect).
   * @param {number} userId
   * @param {import('express').Response} res
   */
  removeClient(userId, res) {
    const conns = this.#clients.get(userId);
    if (!conns) return;
    for (const entry of conns) {
      if (entry.res === res) {
        conns.delete(entry);
        break;
      }
    }
    if (conns.size === 0) this.#clients.delete(userId);
  }

  /** @param {import('express').Response} res */
  #write(res, eventType, data) {
    try {
      res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      // connection already closed – silently discard
    }
  }

  /**
   * Send an event to a specific user (all their active tabs/connections).
   * @param {number|string} userId
   * @param {string} eventType
   * @param {unknown} data
   */
  sendToUser(userId, eventType, data) {
    const conns = this.#clients.get(Number(userId));
    if (!conns) return;
    for (const { res } of conns) this.#write(res, eventType, data);
  }

  /**
   * Send an event to every connected client with a given role.
   * @param {string} role
   * @param {string} eventType
   * @param {unknown} data
   */
  sendToRole(role, eventType, data) {
    for (const conns of this.#clients.values()) {
      for (const { res, role: r } of conns) {
        if (r === role) this.#write(res, eventType, data);
      }
    }
  }

  /**
   * Send an event to every connected client whose role is in the given array.
   * @param {string[]} roles
   * @param {string} eventType
   * @param {unknown} data
   */
  sendToRoles(roles, eventType, data) {
    for (const conns of this.#clients.values()) {
      for (const { res, role } of conns) {
        if (roles.includes(role)) this.#write(res, eventType, data);
      }
    }
  }

  /**
   * Send an event to a list of specific user IDs.
   * @param {(number|string)[]} userIds
   * @param {string} eventType
   * @param {unknown} data
   */
  sendToUsers(userIds, eventType, data) {
    for (const id of userIds) this.sendToUser(id, eventType, data);
  }

  /**
   * Broadcast an event to every connected client regardless of role.
   * @param {string} eventType
   * @param {unknown} data
   */
  broadcast(eventType, data) {
    for (const conns of this.#clients.values()) {
      for (const { res } of conns) this.#write(res, eventType, data);
    }
  }

  /** Total number of currently open connections. */
  get connectedCount() {
    let n = 0;
    for (const conns of this.#clients.values()) n += conns.size;
    return n;
  }
}

export const sseManager = new SSEManager();
