// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventType } from "../../../../Common/CommonScrtips/MyEvent/EventType";
import MyEvent from "../../../../Common/CommonScrtips/MyEvent/MyEvent";
import { LU_CardTpye } from "./LU_CardTpye";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LU_LinkUpCard extends cc.Component {

    cardPos: number[] = [0, 0];
    cardType: LU_CardTpye = LU_CardTpye.card1;
    sprite: cc.Sprite = null;
    card: LU_LinkUpCard = null;

    onEnable() {
        this.card = this.node.getComponent(LU_LinkUpCard);
    }
    SetSprite(spriteframe: cc.SpriteFrame, arrId: number[], size: number[], pos: number[]) {
        switch ( spriteframe.name) {
            case '1':
                this.cardType = LU_CardTpye.card1;
                break;
            case '2':
                this.cardType = LU_CardTpye.card2;
                break;
            case '3':
                this.cardType = LU_CardTpye.card3;
                break;
            case '4':
                this.cardType = LU_CardTpye.card4;
                break;
            case '5':
                this.cardType = LU_CardTpye.card5;
                break;
            case '6':
                this.cardType = LU_CardTpye.card6;
                break;
            case '7':
                this.cardType = LU_CardTpye.card7;
                break;
        }
        this.node.getComponent(cc.Sprite).spriteFrame = spriteframe;
        this.node.width = size[0];
        this.node.height = size[1];
        this.node.setPosition(pos[0], pos[1]);
        this.cardPos = arrId;
    }

    Click() {
        MyEvent.emit(EventType.LU_CardClick, this.card);
        console.log(this.cardType);

    }
    ChangeColor() {
        this.node.color = new cc.Color(139, 139, 139, 255);
        this.node.getComponent(cc.Button).interactable = false;
    }
    ResetColor() {
        this.node.color = new cc.Color(255, 255, 255, 255);
        this.node.getComponent(cc.Button).interactable = true;
    }
}
