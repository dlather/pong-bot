import { pino } from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    singleLine: true,
  },
});
const logger = pino(transport);
export default logger;
