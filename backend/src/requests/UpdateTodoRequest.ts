export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    dueDate: { type: 'string' },
    done: { type: 'boolean' }
  },
} as const;
