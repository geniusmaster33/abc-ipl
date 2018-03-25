import {PredictionData} from './prediction-data'

export class Predictions {

    public highestScorer:PredictionData;
    public bestBowler:PredictionData;
    public mom:PredictionData;
    public winningTeam:PredictionData;
    public score:PredictionData;

    constructor() {
        this.highestScorer = new PredictionData();
        this.bestBowler  = new PredictionData();
        this.mom = new PredictionData();
        this.winningTeam = new PredictionData();
        this.score = new PredictionData();
    }
}