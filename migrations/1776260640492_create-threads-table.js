/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('threads', {
    id: { type: 'text', primaryKey: true },
    title: { type: 'text', notNull: true },
    body: { type: 'text', notNull: true },
    owner: {
      type: 'text',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    // eslint-disable-next-line camelcase
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

export const down = (pgm) => {
  pgm.dropTable('threads');
};


