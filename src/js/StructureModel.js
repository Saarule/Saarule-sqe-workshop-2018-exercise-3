class StructureModel {
    constructor(Line, Type, Name, Condition, Value)
    {
        this.line = Line;
        this.type = Type;
        this.name = Name;
        this.condition = Condition;
        this.value = Value;
    }
    structureModelTrToString(){
        return '<tr>' +
            '<td>'+this.line+'</td>' +
            '<td>'+this.type+'</td>' +
            '<td>'+this.name+'</td>' +
            '<td>'+this.condition+'</td>' +
            '<td>'+this.value+'</td>' +
            '</tr>';
    }
}
export {StructureModel};