#pragma strict


//var m_screenPos:Vector2 = new Vector2 ();
public var ball:GameObject;
public var Pickarea:GameObject;
public var ballprefab:GameObject[];
public var btnTexture : Texture;
public var playerScoreGUI:GUIText;
public var recordScoreGUI:GUIText;
public var threeBallimage : Texture[]=new Texture[5];


private var playerScore:int=0;
private var recordScore:int=0;
private var sqLength:int=0;
private var width:int=0;
private var height:int=0;
private var offset_WHd2:int=0;
private var touchVector:Vector2=new Vector2(-1, -1);
private var ballMatrix:GameObject[,]=new GameObject [9,9];
private var ballMatrixb:int[,]=new int [9,9];
private var road:Vector2[,]=new Vector2[9,9];
private var availibleBallList=new ArrayList();;
private var paths=new ArrayList();
private var state:SystemState;
private var addBallnum:int=0;
private var nextaddBallnum:int=0;
private var pathIdx:int=0;
private var pickBall:Vector2=new Vector2(-1, -1);
private var colorNum:int=5;
private var addballpertime:int=3;
public var nexthreeBall:int[]=new int[3];
enum SystemState{
	idle=0, pick=1, move=2, addball=3

};
enum BallColor{
	No=0, Red=1, Blue=2, Yellow=3, Green=4, White=5
};
function Awake(){
	//允許多點觸碰
    Screen.orientation = ScreenOrientation.LandscapeLeft;
	Input.multiTouchEnabled = false;
	
	//PlayerPrefs.SetInt("Score", 0);
}
function Start () {
    state=SystemState.addball;
    addBallnum=addballpertime;
	width= Screen.width;
	height= Screen.height;
	offset_WHd2=Mathf.Abs(width-height)/2;
	sqLength= height<width?height/9:width/9;
	recordScore=PlayerPrefs.GetInt("Score", 0);
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			var availv:Vector2=new Vector2(i, j);
			availibleBallList.Add(availv);
		}
	}
	nexthreeBall[0]=Random.Range(1, colorNum+1);
	nexthreeBall[1]=Random.Range(1, colorNum+1);
	nexthreeBall[2]=Random.Range(1, colorNum+1);
	Debug.Log(width+", "+height+", "+sqLength+", "+offset_WHd2);
	
}
function SystemReset(){
	nexthreeBall[0]=Random.Range(1, colorNum+1);
	nexthreeBall[1]=Random.Range(1, colorNum+1);
	nexthreeBall[2]=Random.Range(1, colorNum+1);
	touchVector.x=-1;
	touchVector.y=-1;
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			if(ballMatrixb[i, j]){
				Destroy(ballMatrix[i, j]);
				ballMatrixb[i, j]=0;
				availibleBallList.Add(Vector2(i, j));
			}
			road[i, j].x=-1;
			road[i, j].y=-1;
				
		}
	}
	paths.Clear();
	state=SystemState.addball;
    addBallnum=addballpertime;
	pathIdx=0;
	pickBall.x=-1;
	pickBall.y=-1;
	playerScore=0;
	recordScore=PlayerPrefs.GetInt("Score", 0);
}

function OnGUI() {
	if(	GUI.Button(Rect(0, 0, offset_WHd2, offset_WHd2), btnTexture)){
		SystemReset();
	
	}
	var leftbord:int=offset_WHd2+height;
	GUI.Box(Rect(leftbord, offset_WHd2/2, offset_WHd2/3, offset_WHd2/3), threeBallimage[nexthreeBall[0]-1]);
	GUI.Box(Rect(leftbord+offset_WHd2/3, offset_WHd2/2, offset_WHd2/3, offset_WHd2/3), threeBallimage[nexthreeBall[1]-1]);
	GUI.Box(Rect(leftbord+offset_WHd2*2/3, offset_WHd2/2, offset_WHd2/3, offset_WHd2/3), threeBallimage[nexthreeBall[2]-1]);
	//GUI.Box();
	recordScoreGUI.text=recordScore.ToString();
	playerScoreGUI.text=playerScore.ToString();
	/*GUI.Box(Rect(0, 0, 400, 150), touchVector.ToString());
	for(var touch:Touch in Input.touches){
    	var PositionInWorldPoint:Vector3 = Camera.main.ScreenToViewportPoint(touch.position);

    		
    	touchVector.x=Mathf.FloorToInt((PositionInWorldPoint.x*width-offset_WHd2)/sqLength);
	    touchVector.y=Mathf.FloorToInt((height-PositionInWorldPoint.y*height)/sqLength);

	    ball.transform.position.x=touchVector.x*9/8;
	    ball.transform.position.z=-touchVector.y*9/8;
    	
		GUI.Box(Rect(0, 150, 400, 300), touchVector.ToString()+"\n"+touch.position+"\n"+sqLength.ToString());
	}
	GUI.Box(Rect(0, 300, 400, 450), width+", "+height+", "+sqLength+", "+offset_WHd2);*/
	
}
function DeskopInput ()
{
	var mousePositionInWorldPoint:Vector3 = Camera.main.ScreenToViewportPoint(Input.mousePosition);
	//   Screen width  Camera.main.GetScreenWidth()
	//   Screen height  Camera.main.GetScreenHeight()
	//Debug.Log(mousePositionInWorldPoint.x*width+", "+(height-mousePositionInWorldPoint.y*height));
	
    //紀錄滑鼠左鍵的移動距離
    /*var mx:float = Input.GetAxis ("Mouse X");
    
    var my:float = Input.GetAxis ("Mouse Y");
    var speed:float=6.0f;
    if (mx != 0 || my != 0) {
          
    }*/
    //滑鼠左鍵
    if (Input.GetMouseButton (0)) {
        //移動攝影機位置
        //ball.transform.position.x=
        
        touchVector.x=Mathf.FloorToInt((mousePositionInWorldPoint.x*width-offset_WHd2)/sqLength);
        touchVector.y=Mathf.FloorToInt((height-mousePositionInWorldPoint.y*height)/sqLength);
        
        //Debug.Log(touchVector);
        //ball.transform.position.x=touchVector.x*9/8;
        //ball.transform.position.z=-touchVector.y*9/8;
    	//Camera.main.transform.Translate (new Vector3 (-mx * Time.deltaTime*speed, -my * Time.deltaTime*speed, 0));
    }
}

function MobileInput ()
{
	if (Input.touchCount <= 0)
        return;
    else{
    	for(var touch:Touch in Input.touches){
    		var PositionInWorldPoint:Vector3 = Camera.main.ScreenToViewportPoint(touch.position);
    		/*touchVector.x=touch.position.x;
    		touchVector.y=touch.position.y;*/
    		
    		touchVector.x=Mathf.FloorToInt((PositionInWorldPoint.x*width-offset_WHd2)/sqLength);
        	touchVector.y=Mathf.FloorToInt((height-PositionInWorldPoint.y*height)/sqLength);
        
        	//Debug.Log(touchVector);
        	//ball.transform.position.x=touchVector.x*9/8;
        	//ball.transform.position.z=-touchVector.y*9/8;
    	}
    
    }   

}
function Update (){
	if(playerScore>recordScore){
		PlayerPrefs.SetInt("Score", playerScore);
	}
	
	if (Input.GetKeyDown(KeyCode.Escape)){
		Application.Quit(); 
	}
	//判斷平台
    #if !UNITY_EDITOR && (UNITY_IOS || UNITY_ANDROID)
 
    MobileInput ();
 
    #else
 
    DeskopInput();
    #endif
    //Debug.Log(state.ToString());
    //if((touchVector.x>=0 && touchVector.x<=8) && (touchVector.y>=0 && touchVector.y<=8)){

		var av:Vector2;
	    switch(state){
	    	case SystemState.idle:
	    		if((touchVector.x>=0 && touchVector.x<=8) && (touchVector.y>=0 && touchVector.y<=8)){
		    		if(ballMatrixb[touchVector.x, touchVector.y]>0){
		    			pickBall.x=touchVector.x;
		    			pickBall.y=touchVector.y;
		    			state=SystemState.pick;
		    			Pickarea.transform.position.x=touchVector.x*9/8;
		    			Pickarea.transform.position.z=-touchVector.y*9/8;
		    			Pickarea.transform.position.y=-11.98;
					}
	    		}
	    		break;
	    	
	    	case SystemState.pick:
	    		if((touchVector.x>=0 && touchVector.x<=8) && (touchVector.y>=0 && touchVector.y<=8)){
	    			var hasroad:boolean=Astar(pickBall, touchVector);
	    			
	    			if(ballMatrixb[touchVector.x, touchVector.y]>0){
	    				pickBall.x=touchVector.x;
		    			pickBall.y=touchVector.y;
	    				Pickarea.transform.position.x=touchVector.x*9/8;
		    			Pickarea.transform.position.z=-touchVector.y*9/8;
		    			Pickarea.transform.position.y=-11.98;
	    			}
		    	    else if(!ballMatrixb[touchVector.x, touchVector.y] && hasroad){
						ball.transform.position.x=touchVector.x*9/8;
						ball.transform.position.z=-touchVector.y*9/8;
						var pos:Vector3;
						pos=ball.transform.position;
						
						// add ball
						ballMatrix[touchVector.x, touchVector.y]=ballMatrix[pickBall.x, pickBall.y];
						ballMatrix[touchVector.x, touchVector.y].transform.position=pos;
						ballMatrixb[touchVector.x, touchVector.y]=ballMatrixb[pickBall.x, pickBall.y];
						ballMatrixb[pickBall.x, pickBall.y]=0;
						av= Vector2(pickBall.x, pickBall.y);
						availibleBallList.Add(av);
						av= Vector2(touchVector.x, touchVector.y);
						availibleBallList.Remove(av);
						state=SystemState.move;
						Pickarea.transform.position.y=-13;
						
						var current:Vector2=touchVector;
						paths.Clear();
						while(!current.Equals(pickBall)){
							//Debug.Log(road[current.x, current.y]);
							paths.Add(current);
							current=road[current.x, current.y];
						}
						pathIdx=paths.Count-1;
					}
					
					else{
						if(touchVector.x!=pickBall.x || touchVector.y!=pickBall.y){
							if(hasroad){
								state=SystemState.idle;
								touchVector.x=-1;
								touchVector.y=-1;
							}
						}
					}
				}
	    		break;
	    	
	    	case SystemState.move:
	    		//Debug.Log(pathIdx);
	    		if(pathIdx>=0){
	    			//path[pathIdx];
	    			//path[pathIdx].x
	    			var nextP:Vector2=paths[pathIdx];
	    			//Debug.Log(nextP);
	    			ball.transform.position.x=nextP.x*9/8;
					ball.transform.position.z=-nextP.y*9/8;
					var poss:Vector3;
					poss=ball.transform.position;
					ballMatrix[pickBall.x, pickBall.y].transform.position=poss;
					
	    				/*ballMatrix[nextP.x, nextP.y]=ballMatrix[pickBall.x, pickBall.y];
						ballMatrixb[nextP.x, nextP.y]=ballMatrixb[pickBall.x, pickBall.y];
						ballMatrixb[pickBall.x, pickBall.y]=0;
						av= Vector2(pickBall.x, pickBall.y);
						availibleBallList.Add(av);
						av= Vector2(nextP.x, nextP.y);
						availibleBallList.Remove(av);*/
	    			
						
	    			pathIdx--;
	    			
	    		}
	    		else{
		    		if((touchVector.x>=0 && touchVector.x<=8) && (touchVector.y>=0 && touchVector.y<=8)){
			    		var result:int=findLine(touchVector.x, touchVector.y);
			    		playerScore+=result;
			    		//Debug.Log(result);
			    		state=SystemState.addball;
			    		if(!result)addBallnum=3;
		    		}
	    		}
	    		break;
	    	
	    	case SystemState.addball:

	    		//Debug.Log(availibleBallList.Count+", "+addBallnum);
	    		if(addBallnum>0){ 
	    			if(availibleBallList.Count<addBallnum)SystemReset();
	    			var rdnum:int=Random.Range(0, availibleBallList.Count);
	    			//var rdcol:int=Random.Range(1, colorNum+1);
	    			var rdcol:int=nexthreeBall[addBallnum-1];
	    			av=availibleBallList[rdnum];
	    			var xx:int=av.x;
	    			var yy:int=av.y;
	    			
	    			//Debug.Log("add ("+ xx+", "+yy+")"+addBallnum);
		    		//if(!ballMatrixb[xx, yy]){
		    			
						ball.transform.position.x=xx*9.0/8.0;
						ball.transform.position.z=-yy*9.0/8.0;
						var positions:Vector3;
						positions=ball.transform.position;
						// add ball
						//Debug.Log(rdcol+"new!!");
						ballMatrix[xx, yy]=Instantiate(ballprefab[rdcol-1], positions, transform.rotation);
						ballMatrixb[xx, yy]=rdcol;
						availibleBallList.Remove(av);
						//availibleBallList.RemoveAt(rdnum);
						addBallnum--;
						var scoreR:int=findLine(xx, yy);
						recordScore+=scoreR;
						
						nextaddBallnum=3;
					//}
				}
				else if(nextaddBallnum>0){
					nexthreeBall[nextaddBallnum-1]=Random.Range(1, colorNum+1);
					nextaddBallnum--;
				}
				else{
					state=SystemState.idle;
					touchVector.x=-1;
					touchVector.y=-1;
					/*var str:String="";;
					for(var i=0;i<9;i++){
						for(var j=0;j<9;j++){
							str+=ballMatrixb[j, i]+" ";
						}
						str+="\n";
					}
					Debug.Log(str);*/
				}
	    		break;
	    	
	    	
	    
	    
	    }
    //}
    //Debug.Log(touchVector);
    
}

function Astar(start:Vector2, end:Vector2):boolean{
	
	var OPEN =new ArrayList();  //Vector2
	var CLOSE =new ArrayList();  //Vector2
	var Gscore:int[,]=new int[9, 9];
	for(var i:int=0;i<9;i++){
		for(var j:int=0;j<9;j++){
			Gscore[i, j]=9999;
			road[i, j].x=-1;
			road[i, j].y=-1;
		}
	}
	var Fscore:int[,]=new int[9, 9];
	Gscore[start.x, start.y]=0;
	Fscore[start.x, start.y]=Gscore[start.x, start.y]+HN(start, end);
	OPEN.Add(start);
	//road.Add(start);
	while(OPEN.Count>0){
		var lowestFN:int=9999;
	 	var nodeN:Vector2;
	 	for(var vt:Vector2 in OPEN){
	 		var tempFN=GN(start, vt, Gscore)+HN(vt, end);
	 		if(tempFN<lowestFN){
	 			lowestFN=tempFN;
	 			nodeN=vt;
	 		}
	 	}
	 	if(nodeN.Equals(end)){
	 		/*var str:String="";
	 		for(var vv:Vector2 in road){
	 			str+=vv+" ";
	 		}
	 		Debug.Log(str);*/
	 		return true;
	 	}
	 
	 	//move N to CLOSE
	 	OPEN.Remove(nodeN);
		CLOSE.Add(nodeN);
	 	
	 	var CanMove=new ArrayList();
	 	var av:Vector2;
	 	if(nodeN.x+1 <9 && !ballMatrixb[nodeN.x+1, nodeN.y]){
	 		av=Vector2(nodeN.x+1, nodeN.y);
	 		CanMove.Add(av);
	 	}
	 	if(nodeN.x-1 >=0 && !ballMatrixb[nodeN.x-1, nodeN.y]){
	 		av=Vector2(nodeN.x-1, nodeN.y);
	 		CanMove.Add(av);
	 	}
	 	if(nodeN.y+1 <9 && !ballMatrixb[nodeN.x, nodeN.y+1]){
	 		av=Vector2(nodeN.x, nodeN.y+1);
	 		CanMove.Add(av);
	 	}
	 	if(nodeN.y-1 >=0 && !ballMatrixb[nodeN.x, nodeN.y-1]){
	 		av=Vector2(nodeN.x, nodeN.y-1);
	 		CanMove.Add(av);
	 	}
	 	for(var nodeNplus:Vector2 in CanMove){
	 		
	 		//HN ?
	 		
	 		if(CLOSE.Contains(nodeNplus))continue;
	 		var GNplus:int=GN(start, nodeN, Gscore)+1;
	 		if(!OPEN.Contains(nodeNplus) || GNplus<GN(start, nodeNplus, Gscore)){
	 			road[nodeNplus.x, nodeNplus.y]=nodeN;
	 			Gscore[nodeNplus.x, nodeNplus.y]=GNplus;
	 			Fscore[nodeNplus.x, nodeNplus.y]=Gscore[nodeNplus.x, nodeNplus.y]+HN(nodeNplus, end);
	 			if(!OPEN.Contains(nodeNplus)){
	 				OPEN.Add(nodeNplus);
	 			}
	 		}
	 		
	 		var FNplus:int=GNplus +HN(nodeNplus, end);
	 		if(OPEN.Contains(nodeNplus) && FNplus>lowestFN)continue;
	 		if(CLOSE.Contains(nodeNplus) && FNplus>lowestFN)continue;
	 		if(OPEN.Contains(nodeNplus))OPEN.Remove(nodeNplus);
	 		if(CLOSE.Contains(nodeNplus))CLOSE.Remove(nodeNplus);
	 		OPEN.Add(nodeNplus);
		}
	}
	return false;
}

function GN(start:Vector2, end:Vector2, score:int[,]){
	if(start.Equals(end))return 0;
	else{
		return score[end.x, end.y];
	}

}
function HN(start:Vector2, end:Vector2){
	if(start.Equals(end))return 0;
	else return 0;

}
function findLine(xx:int, yy:int){
	
	var MAXLEN:int=5;
	var lineLen:int=1;
	var currentline:int=1;
	var type:int=ballMatrixb[xx, yy];
	if(type==0)return 0;
	var av:Vector2;
	//Debug.Log(xx+", "+yy+", "+type);
	//衡
	for(var i:int=xx-1;i>=0;i--){
		if(ballMatrixb[i, yy]==type){currentline++;}
		else break;
	}
	for(i=xx+1;i<9;i++){
		if(ballMatrixb[i, yy]==type){currentline++;}
		else break;
	}
	if(currentline>=MAXLEN){
		
		for(i=xx-1;i>=0;i--){
			if(ballMatrixb[i, yy]==type){
				Destroy(ballMatrix[i, yy]);
				ballMatrixb[i, yy]=0;
				av= Vector2(i, yy);
				availibleBallList.Add(av);
			}else break;
		}
		for(i=xx+1;i<9;i++){
			if(ballMatrixb[i, yy]==type){
				Destroy(ballMatrix[i, yy]);
				ballMatrixb[i, yy]=0;
				av= Vector2(i, yy);
				availibleBallList.Add(av);
			}else break;
		}
		lineLen+=currentline-1;
	}
	currentline=1;
	//縱
	for(i=yy-1;i>=0;i--){
		if(ballMatrixb[xx, i]==type){currentline++;}
		else break;
	}
	for(i=yy+1;i<9;i++){
		if(ballMatrixb[xx, i]==type){currentline++;}
		else break;
	}
	if(currentline>=MAXLEN){
		for(i=yy-1;i>=0;i--){
			if(ballMatrixb[xx, i]==type){
				Destroy(ballMatrix[xx, i]);ballMatrixb[xx, i]=0;
				av= Vector2(xx, i);
				availibleBallList.Add(av);
			}else break;
		}
		for(i=yy+1;i<9;i++){
			if(ballMatrixb[xx, i]==type){
				Destroy(ballMatrix[xx, i]);ballMatrixb[xx, i]=0;
				av= Vector2(xx, i);
				availibleBallList.Add(av);
			}else break;
		}
		lineLen+=currentline-1;
		/*Destroy(ballMatrix[xx, yy]);ballMatrixb[xx, yy]=0;
		av= Vector2(xx, yy);
		availibleBallList.Add(av);
		//Debug.Log("??");
		return lineLen;*/
	}
	
	currentline=1;
	
	//正斜
	var ii:int;
	var jj:int;
	ii=xx+1;
	jj=yy-1;
	while(ii<9 && jj>=0){
		if(ballMatrixb[ii, jj]==type){currentline++;}
		else break;
		ii++;jj--;
	}
	ii=xx-1;
	jj=yy+1;
	while(ii>=0 && jj<9){
		if(ballMatrixb[ii, jj]==type){currentline++;}
		else break;
		ii--;jj++;
	}
	if(currentline>=MAXLEN){
		ii=xx+1;
		jj=yy-1;
		while(ii<9 && jj>=0){
			if(ballMatrixb[ii, jj]==type){
				Destroy(ballMatrix[ii, jj]);ballMatrixb[ii, jj]=0;
				av= Vector2(ii, jj);
				availibleBallList.Add(av);
			}else break;
			ii++;jj--;
		}
		ii=xx-1;
		jj=yy+1;
		while(ii>=0 && jj<9){
			if(ballMatrixb[ii, jj]==type){
				Destroy(ballMatrix[ii, jj]);ballMatrixb[ii, jj]=0;
				av= Vector2(ii, jj);
				availibleBallList.Add(av);
			}else break;
			ii--;jj++;
		}
		lineLen+=currentline-1;
		/*Destroy(ballMatrix[xx, yy]);ballMatrixb[xx, yy]=0;
		av= Vector2(xx, yy);
		availibleBallList.Add(av);
		//Debug.Log("???");
		return lineLen;*/
	}
	
	currentline=1;
	
	//負斜
	ii=xx-1;
	jj=yy-1;
	while(ii>=0 && jj>=0){
		if(ballMatrixb[ii, jj]==type){currentline++;}
		else break;
		ii--;jj--;
	}
	ii=xx+1;
	jj=yy+1;
	while(ii<9 && jj<9){
		if(ballMatrixb[ii, jj]==type){currentline++;}
		else break;
		ii++;jj++;
	}
	if(currentline>=MAXLEN){
		ii=xx-1;
		jj=yy-1;
		while(ii>=0 && jj>=0){
			if(ballMatrixb[ii, jj]==type){
				Destroy(ballMatrix[ii, jj]);ballMatrixb[ii, jj]=0;
				av= Vector2(ii, jj);
				availibleBallList.Add(av);
			}else break;
			ii--;jj--;
		}
		ii=xx+1;
		jj=yy+1;
		while(ii<9 && jj<9){
			if(ballMatrixb[ii, jj]==type){
				Destroy(ballMatrix[ii, jj]);ballMatrixb[ii, jj]=0;
				av= Vector2(ii, jj);
				availibleBallList.Add(av);
			}else break;
			ii++;jj++;
		}
		lineLen+=currentline-1;
		
		//Debug.Log("????");
		//return currentline;
	}
	if(lineLen>=MAXLEN){
		Destroy(ballMatrix[xx, yy]);ballMatrixb[xx, yy]=0;
		av= Vector2(xx, yy);
		availibleBallList.Add(av);
	}
	currentline=1;
	if(lineLen==1)lineLen=0;
	return lineLen;

}
