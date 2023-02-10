import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  async getAllGames(): Promise<Game[]> {
    const games = await this.gamesService.getAllGames();
    return Object.assign({
      statuscode: 200,
      message: '게임 목록 조회 성공',
      games,
    });
  }

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto): Promise<Game> {
    const newGame = await this.gamesService.createGame(createGameDto);
    return Object.assign({
      statuscode: 200,
      message: '게임 생성 성공',
      newGame,
    });
  }
}
