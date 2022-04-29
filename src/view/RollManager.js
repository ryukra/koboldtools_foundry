
export default class RollManager 
{
    roll(formula) 
    {
        const pieces = this.parse(formula);
        if (pieces === null) 
        {
            return null;
        }

        const results = [];
        results.rolls = [];
        results.modifier = 0;
        results.total = 0;

        // rolls
        for (let i = 0; i < pieces.rolls; i++) 
        {
            results.rolls[i] = (1 + Math.floor(Math.random() * pieces.sides));
        }

        // modifier
        results.modifier = pieces.modifier;

        // total
        for (let i = 0; i < results.rolls.length; i++) 
        {
            results.total += results.rolls[i];
        }
        results.total += pieces.modifier;

        return results.total;
    }
    parse(formula) 
    {
        const matches = formula.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
        if (matches === null || matches[2] === 0) 
        {
            return null;
        }

        const rolls = (matches[1] !== undefined) ? (matches[1] - 0) : 1;
        const sides = (matches[2] !== undefined) ? (matches[2] - 0) : 0;
        const modifier = (matches[3] !== undefined) ? (matches[3] - 0) : 0;

        return {
            rolls,
            sides,
            modifier
        };
    }
    getRandomRecord(m) 
    {
        let recordname = "from PC lists";
        const records = this.store.peekAll(m);
        if (records.get('length') > 0) 
        {
            const rand = Math.floor(Math.random() * records.get('length'));
            recordname = records.objectAt(rand).get('name');
        }
        return recordname;
    }
    isEven(n) 
    {
            return n % 2 === 0;
    }
    isOdd(n) 
    {
        return Math.abs(n % 2) === 1;
    }
    eventRoll()
    {
        game.tables.getName("Event(Standard)").draw();
    }
    detailCheck()
    {
        
    }
}
