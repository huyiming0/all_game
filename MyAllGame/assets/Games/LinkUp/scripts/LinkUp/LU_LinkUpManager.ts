// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventType } from "../../../../Common/CommonScrtips/MyEvent/EventType";
import MyEvent from "../../../../Common/CommonScrtips/MyEvent/MyEvent";
import { LU_CardTpye } from "./LU_CardTpye";
import LU_LinkUpCard from "./LU_LinkUpCard";
import { LU_LinkUpType } from "./LU_LinkUpType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LU_LinkUpManager extends cc.Component {

    @property(cc.SpriteAtlas)
    cardsAtlas: cc.SpriteAtlas = null;
    @property(cc.Prefab)
    card: cc.Prefab = null;
    @property(cc.Node)
    LinkUpCenter: cc.Node = null;

    public rows: number = 20;
    public columns: number = 20;
    public lerp: number = 10;

    public allNodes: Array<Array<LU_LinkUpType>> = null;

    private frameArr: Array<number> = new Array<number>();

    private cardWidth: number = 60;
    private cardHeight: number = 60;

    private clicdIndex: number = 0;
    private arr1: Array<string>;
    private arr2: Array<Array<string>>;

    onLoad() {
        this.init();
        MyEvent.on(EventType.LU_CardClick, this.CardClick.bind(this), 'cardClick');
    }
    init() {
        this.initValue();
        this.initNodesArr();
        this.initCreateLinkNumber();
        this.initCreateNodes();
    }
    initValue() {
        this.cardWidth = 700 / this.rows - this.lerp;
        this.cardHeight = 700 / this.columns - this.lerp;
    }
    /**初始化二维数组 */
    initNodesArr() {
        this.allNodes = new Array<Array<LU_LinkUpType>>(this.rows + 2);
        for (let i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i] = new Array<LU_LinkUpType>(this.columns + 2);
            for (let j = 0; j < this.allNodes[i].length; j++) {
                this.allNodes[i][j] = LU_LinkUpType.noCard;
            }
        }
    }
    /**生成每个位置上对应的元素信息 */
    initCreateLinkNumber() {
        const length = this.rows * this.columns / 2;
        this.frameArr = new Array<number>();
        let arr = new Array<number>();
        for (let i = 0; i < length; i++) {
            let num = Math.ceil(Math.random() * 7)
            arr.push(num);
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < arr.length; j++) {
                this.frameArr.push(arr[j])
            }
        }
        for (let i = 0; i < this.frameArr.length; i++) {
            let j = Math.floor(Math.random() * this.frameArr.length)
            let num2 = this.frameArr[i];
            this.frameArr[i] = this.frameArr[j];
            this.frameArr[j] = num2;
        }
    }
    /**生成结点 */
    initCreateNodes() {
        let index = 0;
        for (let i = 1; i < this.allNodes.length - 1; i++) {
            this.allNodes[i] = new Array<LU_LinkUpType>(this.columns + 2);
            this.allNodes[i][0] = LU_LinkUpType.noCard;
            this.allNodes[i][this.allNodes[i].length - 1] = LU_LinkUpType.noCard;
            for (let j = 1; j < this.allNodes[i].length - 1; j++) {
                let cardNode = cc.instantiate(this.card);
                let card = cardNode.getComponent(LU_LinkUpCard);
                let frame = this.cardsAtlas.getSpriteFrame(this.frameArr[index] + '');
                index++;
                let cardx = this.lerp / 2 + this.cardWidth / 2 + (j - 1) * (this.cardWidth + this.lerp);
                let cardy = -(this.lerp / 2 + this.cardWidth / 2 + (i - 1) * (this.cardHeight + this.lerp));
                let pos = [cardx, cardy]

                card.SetSprite(frame, [i, j], [this.cardWidth, this.cardHeight], pos)
                this.LinkUpCenter.addChild(cardNode);
                this.allNodes[i][j] = LU_LinkUpType.hasCard;
            }
        }
    }
    firstCard: LU_LinkUpCard;
    secondCard: LU_LinkUpCard;
    /**点击卡片 */
    CardClick(data) {
        if (this.clicdIndex == 0) {
            this.firstCard = data;
            this.firstCard.ChangeColor();
            this.clicdIndex++;
        } else if (this.clicdIndex == 1) {
            this.secondCard = data;
            this.secondCard.ChangeColor();
            this.clicdIndex++;
            /**触发消除行为 */
            if (this.firstCard.cardType == this.secondCard.cardType) {
                if (this.LinkUp(this.firstCard, this.secondCard)) {
                    this.allNodes[this.firstCard.cardPos[0]][this.firstCard.cardPos[1]] = LU_LinkUpType.noCard;
                    this.allNodes[this.secondCard.cardPos[0]][this.secondCard.cardPos[1]] = LU_LinkUpType.noCard;
                    this.firstCard.node.destroy();
                    this.secondCard.node.destroy();
                } else {
                    this.firstCard.ResetColor();
                    this.secondCard.ResetColor();
                }
            } else {
                this.firstCard.ResetColor();
                this.secondCard.ResetColor();
            }
            this.clicdIndex = 0;

        }
    }
    LinkUp(card1: LU_LinkUpCard, card2: LU_LinkUpCard) {
        let start = card1.cardPos;
        let end = card2.cardPos;
        //初始方向
        this.arr1 = new Array<string>();
        this.arr2 = new Array<Array<string>>();
        let isok1 = this.createLink(start, [start[0] - 1, start[1]], end, Direction.none, Direction.up, 0, new Array<boolean>((this.rows + 2) * (this.columns + 2)))
        let isok2 = this.createLink(start, [start[0] + 1, start[1]], end, Direction.none, Direction.down, 0, new Array<boolean>((this.rows + 2) * (this.columns + 2)))
        let isok3 = this.createLink(start, [start[0], start[1] - 1], end, Direction.none, Direction.left, 0, new Array<boolean>((this.rows + 2) * (this.columns + 2)))
        let isok4 = this.createLink(start, [start[0], start[1] + 1], end, Direction.none, Direction.right, 0, new Array<boolean>((this.rows + 2) * (this.columns + 2)))
        console.log(this.arr1);
        console.log(this.arr2);
        return isok1 || isok2 || isok3 || isok4;
    }
    allArr: Array<Array<number>> = new Array<Array<number>>();
    @property(cc.Node)
    test: cc.Node = null;
    createLink(last: number[], start: number[], end: number[], oldDir: Direction, newdir: Direction, time: number, pathArr) {
        if (start[0] < 0 || start[0] > this.columns + 1 || start[1] < 0 || start[1] > this.rows + 1) {
            return false;
        }
        let num = start[0] * (this.columns + 1) + start[1] + 1;
        if (pathArr[num]) {
            return false;
        }
        pathArr[num] = true;
        if (this.allNodes[start[0]][start[1]] != 0) {
            if (start[0] == end[0] && start[1] == end[1]) {
                let t = this.creattime(oldDir, time, newdir, last, start);
                if (t.isTime) {
                    time = t.time;
                } else {
                    pathArr[num] = false;
                    return false;
                }
                let arr = new Array<string>();
                for (let i = 0; i < this.arr1.length; i++) {
                    arr.push(this.arr1[i]);
                }
                this.arr2.push(arr);
                return true;
            } else {
                pathArr[num] = false;
                return false;
            }
        }
        let t = this.creattime(oldDir, time, newdir, last, start);
        if (t.isTime) {
            time = t.time;
        } else {
            pathArr[num] = false;
            return false;
        }

        let value1 = this.createLink(start, [start[0] - 1, start[1]], end, newdir, Direction.up, time, pathArr)
        let value2 = this.createLink(start, [start[0] + 1, start[1]], end, newdir, Direction.down, time, pathArr)
        let value3 = this.createLink(start, [start[0], start[1] - 1], end, newdir, Direction.left, time, pathArr)
        let value4 = this.createLink(start, [start[0], start[1] + 1], end, newdir, Direction.right, time, pathArr);
        return value1 || value2 || value3 || value4;
    }


    private creattime(oldDir: Direction, time: number, newdir: Direction, last: number[], start: number[]) {
        if (oldDir == Direction.none) {
            time = 0;
        } else {
            if (oldDir != newdir) {
                time++;
                if (time >= 3) {
                    this.arr1.length = 0;
                    return { isTime: false, time: time };
                }
                let lerp = last[0] + "," + last[1] + '/' + oldDir + '=>' + start[0] + "," + start[1] + "/" + newdir;
                this.arr1.push(lerp);
            }
        }
        return { isTime: true, time: time };
    }
}
enum Direction {
    none = 'none',
    up = 'up',
    down = 'down',
    left = 'left',
    right = 'right',
}