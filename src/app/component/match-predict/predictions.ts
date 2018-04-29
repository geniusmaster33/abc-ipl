import {PredictionData} from './prediction-data'

export class Predictions {

    public highestScorer:PredictionData;
    public bestBowler:PredictionData;
    public mom:PredictionData;
    public winningTeam:PredictionData;
    public score:PredictionData;

    public score30Plus:PredictionData;
    public sixes: PredictionData;
    public wickets: PredictionData;

    constructor() {
        this.highestScorer = new PredictionData();
        this.bestBowler  = new PredictionData();
        this.mom = new PredictionData();
        this.winningTeam = new PredictionData();
        this.score = new PredictionData();

        this.score30Plus = new PredictionData();
        this.sixes = new PredictionData();
        this.wickets = new PredictionData();
    }
}