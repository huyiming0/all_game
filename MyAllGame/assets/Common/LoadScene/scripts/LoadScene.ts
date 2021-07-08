// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LoadBundleManager from "../../CommonScrtips/LoadBundle/LoadBundleManager";
import { EventType } from "../../CommonScrtips/MyEvent/EventType";
import MyEvent from "../../CommonScrtips/MyEvent/MyEvent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadScene extends cc.Component {

    @property(cc.String)
    BundleName: string = '';

    onLoad() {

    }

    LoadBundle() {
        LoadBundleManager.BundleName = this.BundleName;
        LoadBundleManager.LoadBundle();
        MyEvent.on(EventType.LoadBundleOver,()=>{},'LoadBundleOver')
    }
}
