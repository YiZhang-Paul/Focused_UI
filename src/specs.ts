import { container } from './core/ioc/container';

beforeEach(() => {
    process.env.VUE_APP_BASE_API_URL = 'api/v1';
    container.snapshot();
});

afterEach(() => container.restore());
