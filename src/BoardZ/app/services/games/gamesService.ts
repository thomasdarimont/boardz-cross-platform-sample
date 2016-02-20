import {Injectable} from 'angular2/core';
import {Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Logger} from '../logging/logger';
import {AuthenticatedHttp} from '../http/AuthenticatedHttp';

export class Packshot {
    frontImageUrl: string;
    topImageUrl: string;
    leftImageUrl: string;
    rightImageUrl: string;
    bottomImageUrl: string;
}

export class Game {
    id: string = null;
    name: string;
    description: string;
    packshot: Packshot;
    userName: string;
}

@Injectable()
export class GamesService {

    constructor(private _logger: Logger, private _http: AuthenticatedHttp) {

    }

    private buildOptions() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Accept', 'text/plain');
        headers.append('Accept', '*/*');
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        return { headers: headers };
    }

    private fetchGames(): Observable<Game[]> {
        return this._http.get('api/boardgames/list').map(response => (<Game[]>response.json()));
    }

    public deepClone(game: Game): Game {
        return <Game>JSON.parse(JSON.stringify(game));
    }

    public getGames(): Promise<Game[]> {
        return this.fetchGames().toPromise();
    }

    public getGamesCount(): Promise<number> {
        return this.fetchGames()
            .map(games => games.length)
            .toPromise();
    }

    public getGame(id: string): Promise<Game> {
        return this._http.get(`api/boardgames/single?id=${id}`)
            .map(response => <Game>response.json())
            .toPromise();
    }

    public addGame(game: Game): Promise<string> {
        return this._http.post(`api/boardgames/add`, JSON.stringify(game), this.buildOptions())
            .map(response => <string>response.json())
            .toPromise()
    }

    public updateGame(game: Game): Promise<string> {
        return this._http.put(`api/boardgames/update`, JSON.stringify(game), this.buildOptions())
            .map(response => game.id)
            .toPromise()
    }

    public deleteGame(id: string): Promise<string> {
        return this._http.delete(`api/boardgames/remove?id=${id}`)
            .map(response => <string>response.text())
            .toPromise();
    }

}