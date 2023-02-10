import { Module } from '@nestjs/common';
import { GamesService } from 'src/games/games.service';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, GamesService],
})
export class EventsModule {}
