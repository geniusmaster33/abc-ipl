export class PredictionData {
    
    public prediction:any = "";
    public assignedPoints:number;

    public isValid() : boolean {
        //console.log(this.prediction + " - " + (Number(this.assignedPoints) == 0) + " -- " + !this.assignedPoints);

        if(this.prediction != '' && (!this.assignedPoints || Number(this.assignedPoints) <= 0)) {
            return false;
        }
        else {
            return true;
        }
    }
}