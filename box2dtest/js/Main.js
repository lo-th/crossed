/**
 * @author kozakluke@gmail.com
 */
(function Main()
{
    const STAGE_WIDTH = window.innerWidth, STAGE_HEIGHT = window.innerHeight;
    const METER = 100;
    
    var bodies = [], actors = [];
    var stage, renderer;
    var world, mouseJoint;
    var touchX, touchY;
    var isBegin;
    var stats;
    
	(function init()
	{
		if (!window.requestAnimationFrame) 
		{
			window.requestAnimationFrame = (function() {
				return window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			})();
		}
		
		window.onload = onLoad;
	})();
	
	function onLoad()
	{
        const container = document.createElement("div");
        document.body.appendChild(container);
        
        stats = new Stats();
        container.appendChild(stats.domElement);
        stats.domElement.style.position = "absolute";
        
        stage = new PIXI.Stage(0xDDDDDD, true);
        
        renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT, undefined, false);
        document.body.appendChild(renderer.view);
        
        const loader = new PIXI.AssetLoader(["assets/ball.png",
                                             "assets/box.jpg"]);
        loader.onComplete = onLoadAssets;
        loader.load();
	}
    
    function onLoadAssets()
    {
        world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 10),  true);
        
        const polyFixture = new Box2D.Dynamics.b2FixtureDef();
        polyFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
        polyFixture.density = 1;
        
        const circleFixture	= new Box2D.Dynamics.b2FixtureDef();
        circleFixture.shape	= new Box2D.Collision.Shapes.b2CircleShape();
        circleFixture.density = 1;
        circleFixture.restitution = 0.7;
        
        const bodyDef = new Box2D.Dynamics.b2BodyDef();
        bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
        
        //down
        polyFixture.shape.SetAsBox(10, 1);
        bodyDef.position.Set(9, STAGE_HEIGHT / METER + 1);
        world.CreateBody(bodyDef).CreateFixture(polyFixture);
        
        //left
        polyFixture.shape.SetAsBox(1, 100);
        bodyDef.position.Set(-1, 0);
        world.CreateBody(bodyDef).CreateFixture(polyFixture);
        
        //right
        bodyDef.position.Set(STAGE_WIDTH / METER + 1, 0);
        world.CreateBody(bodyDef).CreateFixture(polyFixture);
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
        
        for (var i = 0; i < 40; i++)
        {
            bodyDef.position.Set(MathUtil.rndRange(0, STAGE_WIDTH) / METER, -MathUtil.rndRange(50, 5000) / METER);
            var body = world.CreateBody(bodyDef);
            var s;
            if (Math.random() > 0.5)
            {
                s = MathUtil.rndRange(70, 100);
                circleFixture.shape.SetRadius(s / 2 / METER);
                body.CreateFixture(circleFixture);
                bodies.push(body);
                
                var ball = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/ball.png"));
                stage.addChild(ball);
                ball.i = i;
                ball.anchor.x = ball.anchor.y = 0.5;
                ball.scale.x = ball.scale.y = s / 100;
                
                actors[actors.length] = ball;
            }
            else
            {
                s = MathUtil.rndRange(50, 100);
                polyFixture.shape.SetAsBox(s / 2 / METER, s / 2 / METER);
                body.CreateFixture(polyFixture);
                bodies.push(body);
                
                var box = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/box.jpg"));
                stage.addChild(box);
                box.i = i;
                box.anchor.x = box.anchor.y = 0.5;
                box.scale.x = s / 100;
                box.scale.y = s / 100;
                
                actors[actors.length] = box;
            }
        }
        
        document.addEventListener("mousedown", function(event) {
            isBegin = true;
            onMove(event);
            document.addEventListener("mousemove", onMove, true);
        }, true);
        
        document.addEventListener("mouseup", function(event) {
            document.removeEventListener("mousemove", onMove, true);
            isBegin = false;
            touchX = undefined;
            touchY = undefined;
        }, true);
        
        renderer.view.addEventListener("touchstart", function(event) {
            isBegin = true;
            onMove(event);
            renderer.view.addEventListener("touchmove", onMove, true);
        }, true);
        
        renderer.view.addEventListener("touchend", function(event) {
            renderer.view.removeEventListener("touchmove", onMove, true);
            isBegin = false;
            touchX = undefined;
            touchY = undefined;
        }, true);
        
        update();
    }
    
    function getBodyAtMouse()
    {
        const mousePos = new Box2D.Common.Math.b2Vec2(touchX, touchY);
        const aabb = new Box2D.Collision.b2AABB();
        aabb.lowerBound.Set(touchX - 0.001, touchY - 0.001);
        aabb.upperBound.Set(touchX + 0.001, touchY + 0.001);
        
        var body;
        world.QueryAABB(
            function (fixture)
            {
                if(fixture.GetBody().GetType() != Box2D.Dynamics.b2BodyDef.b2_staticBody)
                {
                    if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePos)) {
                        body = fixture.GetBody();
                        return false;
                    }
                }
                return true;
            }, aabb);
        
        return body;
    }
    
    function onMove(event)
    {
        if (event["changedTouches"])
        {
            var touche = event["changedTouches"][0];
            touchX = touche.pageX / METER;
            touchY = touche.pageY / METER;
        }
        else {
            touchX = event.clientX / METER;
            touchY = event.clientY / METER;
        }
    }
    
	function update()
	{
		requestAnimationFrame(update);
        
        if(isBegin && !mouseJoint)
        {
            const dragBody = getBodyAtMouse();
            if(dragBody)
			{
                const jointDef = new Box2D.Dynamics.Joints.b2MouseJointDef();
                jointDef.bodyA = world.GetGroundBody();
                jointDef.bodyB = dragBody;
                jointDef.target.Set(touchX, touchY);
                jointDef.collideConnected = true;
                jointDef.maxForce = 300.0 * dragBody.GetMass();
                mouseJoint = world.CreateJoint(jointDef);
                dragBody.SetAwake(true);
            }
        }
        
        if(mouseJoint)
        {
            if(isBegin)
                mouseJoint.SetTarget(new Box2D.Common.Math.b2Vec2(touchX, touchY));
            else {
                world.DestroyJoint(mouseJoint);
                mouseJoint = null;
            }
        }
        
        world.Step(1 / 60,  3,  3);
        world.ClearForces();
        
        const n = actors.length;
        for (var i = 0; i < n; i++)
        {
            var body  = bodies[i];
            var actor = actors[i];
            var position = body.GetPosition();
            actor.position.x = position.x * 100;
            actor.position.y = position.y * 100;
            actor.rotation = body.GetAngle();
        }
        
        renderer.render(stage);
        stats.update();
	}
})();
