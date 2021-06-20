import { PerformanceRating } from './performance-rating';

export class UserProfile {
    public name = '';
    public avatarUrl = '';
    public focusSessionId = '';
    public ratings = new PerformanceRating();
}
