const preload = () => {
  const section = document.querySelector(".specialty-section");
  if (!section) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.THREE || !THREE.FontLoader) {
    console.error("The original automation particle effect could not load Three.js and FontLoader.");
    return;
  }

  const manager = new THREE.LoadingManager();
  manager.onError = (url) => console.error("The original automation particle effect could not load:", url);
  manager.onLoad = function() {
    try {
      new Environment(section, typo, particle);
    } catch (error) {
      section.querySelector("#automation-particles canvas")?.remove();
      console.error("The original automation particle effect could not be initialized:", error);
    }
  }

  let typo = null;
  const loader = new THREE.FontLoader( manager );
  loader.load(
    'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json',
    (font) => { typo = font; },
    undefined,
    (error) => console.error("The original automation particle font could not be loaded:", error)
  );
  const particle = new THREE.TextureLoader( manager ).load(
    'https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png',
    undefined,
    undefined,
    (error) => console.error("The original automation particle texture could not be loaded:", error)
  );

}

if ( document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll))
  preload ();
else
  document.addEventListener("DOMContentLoaded", preload );

class Environment {

  constructor(section, font, particle) {

    this.font = font;
    this.particle = particle;
    this.container = section.querySelector("#automation-particles");
    this.scene = new THREE.Scene();
    this.motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.createCamera();
    this.createRenderer();
    this.setup();
    this.bindEvents();
    section.classList.add("has-particle-animation");
    this.updateAnimationLoop();
  }

  bindEvents(){

    window.addEventListener( 'resize', this.onWindowResize.bind( this ));
    document.addEventListener("visibilitychange", this.updateAnimationLoop.bind(this));
    this.motionPreference.addEventListener("change", this.updateAnimationLoop.bind(this));
  }

  setup(){

    this.createParticles = new CreateParticles( this.scene, this.font,             this.particle, this.camera, this.renderer );
  }

  render() {

     this.createParticles.render()
     this.renderer.render( this.scene, this.camera )
  }

  createCamera() {

    this.camera = new THREE.PerspectiveCamera( 65, this.container.clientWidth /  this.container.clientHeight, 1, 10000 );
    this.camera.position.set( 0,0, 100 );

  }

  createRenderer() {

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio( Math.min( window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild( this.renderer.domElement );

  }

  onWindowResize(){

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.createParticles.resize();
  }

  updateAnimationLoop() {
    if (this.motionPreference.matches || document.hidden) {
      this.renderer.setAnimationLoop(null);
      return;
    }
    this.renderer.setAnimationLoop(() => this.render());
  }
}

class CreateParticles {

    constructor( scene, font, particleImg, camera, renderer ) {

        this.scene = scene;
        this.font = font;
        this.particleImg = particleImg;
        this.camera = camera;
        this.renderer = renderer;
        this.container = renderer.domElement;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-200, 200);

        this.colorChange = new THREE.Color();

        this.buttonDown = false;

        this.data = {

            text: 'ESPECIALISTA EM \n AUTOMAÇÃO',
            amount: 10000,
            particleSize: 1,
            particleColor: 0xffffff,
            textSize: 16,
            area: 250,
            ease: .05,
        }

        this.setup();
        this.bindEvents();

    }


    setup(){

        const geometry = new THREE.PlaneGeometry( this.visibleWidthAtZDepth( 100, this.camera ), this.visibleHeightAtZDepth( 100, this.camera ));
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );
        this.planeArea = new THREE.Mesh( geometry, material );
        this.planeArea.visible = false;
        this.createText();

    }

    bindEvents() {

        this.container.addEventListener("pointerdown", this.onPointerDown.bind(this));
        this.container.addEventListener("pointermove", this.onPointerMove.bind(this));
        this.container.addEventListener("pointerup", this.onPointerUp.bind(this));
        this.container.addEventListener("pointercancel", this.onPointerUp.bind(this));
        this.container.addEventListener("pointerleave", this.onPointerLeave.bind(this));

    }

    updatePointer(event) {
        const bounds = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        this.mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    }

    onPointerDown(event) {
        if (event.button !== 0) return;
        this.updatePointer(event);
        this.buttonDown = true;
        this.data.ease = .01;
        this.container.setPointerCapture(event.pointerId);
    }

    onPointerUp() {

        this.buttonDown = false;
        this.data.ease = .05;
    }

    onPointerMove(event) {

        this.updatePointer(event);
    }

    onPointerLeave() {
        if (this.buttonDown) return;
        this.mouse.set(-200, 200);
    }

    render( level ){

        const time = ((.001 * performance.now())%12)/12;
        const zigzagTime = (1 + (Math.sin( time * 2 * Math.PI )))/6;

        this.raycaster.setFromCamera( this.mouse, this.camera );

        const intersects = this.raycaster.intersectObject( this.planeArea );

        if ( intersects.length > 0 ) {

            const pos = this.particles.geometry.attributes.position;
            const copy = this.geometryCopy.attributes.position;
            const coulors = this.particles.geometry.attributes.customColor;
            const size = this.particles.geometry.attributes.size;

            const mx = intersects[ 0 ].point.x;
            const my = intersects[ 0 ].point.y;
            const mz = intersects[ 0 ].point.z;

            for ( var i = 0, l = pos.count; i < l; i++) {

                const initX = copy.getX(i);
                const initY = copy.getY(i);
                const initZ = copy.getZ(i);

                let px = pos.getX(i);
                let py = pos.getY(i);
                let pz = pos.getZ(i);

                this.colorChange.setHSL( .5, 1 , 1 )
                coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
                coulors.needsUpdate = true;

                size.array[ i ]  = this.data.particleSize;
                size.needsUpdate = true;

                let dx = mx - px;
                let dy = my - py;
                const dz = mz - pz;

                const mouseDistance = this.distance( mx, my, px, py )
                let d = ( dx = mx - px ) * dx + ( dy = my - py ) * dy;
                const f = - this.data.area * this.interactionScale ** 2 / Math.max(d, 1);

                if( this.buttonDown ){

                    const t = Math.atan2( dy, dx );
                    px -= f * Math.cos( t );
                    py -= f * Math.sin( t );

                    this.colorChange.setHSL( .5 + zigzagTime, 1.0 , .5 )
                    coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
                    coulors.needsUpdate = true;

                    const clickDistance = 70 * this.interactionScale;
                    if ((px > (initX + clickDistance)) || ( px < (initX - clickDistance)) || (py > (initY + clickDistance) || ( py < (initY - clickDistance)))){

                        this.colorChange.setHSL( .15, 1.0 , .5 )
                        coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
                        coulors.needsUpdate = true;

                    }

                }else{

                    if( mouseDistance < this.data.area * this.interactionScale ){

                        if(i%5==0){

                            const t = Math.atan2( dy, dx );
                            px -= .03 * Math.cos( t );
                            py -= .03 * Math.sin( t );

                            this.colorChange.setHSL( .15 , 1.0 , .5 )
                            coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
                            coulors.needsUpdate = true;

                            size.array[ i ]  =  this.data.particleSize /1.2;
                            size.needsUpdate = true;

                        }else{

                            const t = Math.atan2( dy, dx );
                            px += f * Math.cos( t );
                            py += f * Math.sin( t );

                            pos.setXYZ( i, px, py, pz );
                            pos.needsUpdate = true;

                            size.array[ i ]  = this.data.particleSize * 1.3 ;
                            size.needsUpdate = true;
                        }

                        const hoverDistance = 10 * this.interactionScale;
                        if ((px > (initX + hoverDistance)) || ( px < (initX - hoverDistance)) || (py > (initY + hoverDistance) || ( py < (initY - hoverDistance)))){

                            this.colorChange.setHSL( .15, 1.0 , .5 )
                            coulors.setXYZ( i, this.colorChange.r, this.colorChange.g, this.colorChange.b )
                            coulors.needsUpdate = true;

                            size.array[ i ]  = this.data.particleSize /1.8;
                            size.needsUpdate = true;

                        }
                    }

                }

                px += ( initX  - px ) * this.data.ease;
                py += ( initY  - py ) * this.data.ease;
                pz += ( initZ  - pz ) * this.data.ease;

                pos.setXYZ( i, px, py, pz );
                pos.needsUpdate = true;

            }
        } else {
            const pos = this.particles.geometry.attributes.position;
            const copy = this.geometryCopy.attributes.position;
            const colors = this.particles.geometry.attributes.customColor;
            const size = this.particles.geometry.attributes.size;

            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                const py = pos.getY(i);
                const pz = pos.getZ(i);
                pos.setXYZ(
                    i,
                    px + (copy.getX(i) - px) * this.data.ease,
                    py + (copy.getY(i) - py) * this.data.ease,
                    pz + (copy.getZ(i) - pz) * this.data.ease
                );
                colors.setXYZ(i, 1, 1, 1);
                size.array[i] = this.data.particleSize;
            }

            pos.needsUpdate = true;
            colors.needsUpdate = true;
            size.needsUpdate = true;
        }
    }

    createText(){

        let thePoints = [];

        let shapes = this.font.generateShapes( this.data.text , this.data.textSize  );
        let geometry = new THREE.ShapeGeometry( shapes );
        geometry.computeBoundingBox();
        const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        this.textScale = Math.min(
            1,
            (this.visibleWidthAtZDepth(0, this.camera) * 0.9) / textWidth
        );
        this.interactionScale = Math.min(
            1,
            this.visibleWidthAtZDepth(0, this.camera) / this.data.area
        );

        const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        const yMid =  (geometry.boundingBox.max.y - geometry.boundingBox.min.y)/2.85;

        geometry.center();

        let holeShapes = [];

        for ( let q = 0; q < shapes.length; q ++ ) {

            let shape = shapes[ q ];

            if ( shape.holes && shape.holes.length > 0 ) {

                for ( let  j = 0; j < shape.holes.length; j ++ ) {

                    let  hole = shape.holes[ j ];
                    holeShapes.push( hole );
                }
            }

        }
        shapes.push.apply( shapes, holeShapes );

        let colors = [];
        let sizes = [];

        for ( let  x = 0; x < shapes.length; x ++ ) {

            let shape = shapes[ x ];

            const responsiveAmount = this.data.amount * this.textScale;
            const amountPoints = ( shape.type == 'Path') ? responsiveAmount/2 : responsiveAmount;

            let points = shape.getSpacedPoints( amountPoints ) ;

            points.forEach( ( element, z ) => {

                const a = new THREE.Vector3(
                    element.x * this.textScale,
                    element.y * this.textScale,
                    0
                );
                thePoints.push( a );
                colors.push( this.colorChange.r, this.colorChange.g, this.colorChange.b);
                sizes.push( 1 )

                });
        }

        let geoParticles = new THREE.BufferGeometry().setFromPoints( thePoints );
        geoParticles.translate( xMid * this.textScale, yMid * this.textScale, 0 );
        geometry.dispose();

        geoParticles.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
        geoParticles.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1) );

        const material = new THREE.ShaderMaterial( {

            uniforms: {
                color: { value: new THREE.Color( 0xffffff ) },
                pointTexture: { value: this.particleImg }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
        } );

        this.particles = new THREE.Points( geoParticles, material );
        this.scene.add( this.particles );

        this.geometryCopy = new THREE.BufferGeometry();
        this.geometryCopy.copy( this.particles.geometry );

    }

    visibleHeightAtZDepth ( depth, camera ) {

      const cameraOffset = camera.position.z;
      if ( depth < cameraOffset ) depth -= cameraOffset;
      else depth += cameraOffset;

      const vFOV = camera.fov * Math.PI / 180;

      return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
    }

    visibleWidthAtZDepth( depth, camera ) {

      const height = this.visibleHeightAtZDepth( depth, camera );
      return height * camera.aspect;

    }

    distance (x1, y1, x2, y2){

        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    resize() {
        this.planeArea.geometry.dispose();
        this.planeArea.geometry = new THREE.PlaneGeometry(
            this.visibleWidthAtZDepth(100, this.camera),
            this.visibleHeightAtZDepth(100, this.camera)
        );

        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            this.geometryCopy.dispose();
        }
        this.createText();
    }
}
