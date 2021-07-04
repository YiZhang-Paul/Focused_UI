import 'reflect-metadata';
import { Container } from 'inversify';

import { UserProfileHttpService } from '../services/http/user-profile-http/user-profile-http.service';
import { TimeSessionHttpService } from '../services/http/time-session-http/time-session-http.service';
import { WorkItemHttpService } from '../services/http/work-item-http/work-item-http.service';
import { PerformanceHttpService } from '../services/http/performance-http/performance-http.service';

import { types } from './types';

export const container = new Container();

container
    .bind<UserProfileHttpService>(types.UserProfileHttpService)
    .to(UserProfileHttpService)
    .inTransientScope();

container
    .bind<TimeSessionHttpService>(types.TimeSessionHttpService)
    .to(TimeSessionHttpService)
    .inTransientScope();

container
    .bind<WorkItemHttpService>(types.WorkItemHttpService)
    .to(WorkItemHttpService)
    .inTransientScope();

container
    .bind<PerformanceHttpService>(types.PerformanceHttpService)
    .to(PerformanceHttpService)
    .inTransientScope();
