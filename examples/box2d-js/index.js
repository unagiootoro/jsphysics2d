"use strict";
(() => {
  // ../../src/b2Math.ts
  var b2Vec2 = class _b2Vec2 {
    constructor(u0, u1) {
      this.u0 = u0;
      this.u1 = u1;
    }
    set(u0, u1) {
      this.u0 = u0;
      this.u1 = u1;
    }
    copy() {
      return new _b2Vec2(this.u0, this.u1);
    }
    neg() {
      return new _b2Vec2(-this.u0, -this.u1);
    }
    perpendicular() {
      return new _b2Vec2(this.u1, -this.u0);
    }
    length() {
      return Math.sqrt(this.u0 * this.u0 + this.u1 * this.u1);
    }
    normalize() {
      const l = this.length();
      if (l < Number.MIN_VALUE) {
        return copy();
      }
      const invLength = 1 / length;
      const u0 = invLength * this.u0;
      const u1 = invLength * this.u1;
      return new _b2Vec2(u0, u1);
    }
  };
  var b2Mat22 = class _b2Mat22 {
    constructor(v0, v1) {
      this.v0 = v0.copy();
      this.v1 = v1.copy();
    }
    set(m) {
      this.v0.set(m.v0);
      this.v1.set(m.v1);
    }
    copy() {
      return new _b2Mat22(this.v0, this.v1);
    }
  };
  function b2Dot(a, b) {
    return a.u0 * b.u0 + a.u1 * b.u1;
  }
  function b2SubVV(a, b) {
    const u0 = a.u0 - b.u0;
    const u1 = a.u1 - b.u1;
    return new b2Vec2(u0, u1);
  }
  function b2Interp(v0, v1, t) {
    const u0 = v0.u0 + t * (v1.u0 - v0.u0);
    const u1 = v0.u1 + t * (v1.u1 - v0.u1);
    return new b2Vec2(u0, u1);
  }
  function b2Distance(n, v, x) {
    const u0 = n.u0 * (x.u0 - v.u0);
    const u1 = n.u1 * (x.u1 - v.u1);
    return u0 + u1;
  }
  function b2Inverse(a, b, c, d) {
    const det = a * d - b * c;
    const invDet = 1 / det;
    const c1 = new b2Vec2(invDet * d, -invDet * c);
    const c2 = new b2Vec2(-invDet * b, invDet * a);
    return new b2Mat22(c1, c2);
  }

  // ../../src/b2Manifold.ts
  function isEqualId(id1, id2) {
    return id1[0] === id2[0] && id1[1] === id2[1] && id1[2] === id2[2] && id1[3] === id2[3];
  }
  var b2ContactPoint = class {
    constructor() {
      this.separation = 0;
      this.massNormal = 0;
      this.massTangent = 0;
      this.bias = 0;
      this.Pn = 0;
      this.Pt = 0;
    }
  };
  var b2Manifold = class {
    constructor(body1, body2) {
      this.body1 = body1;
      this.body2 = body2;
      this.contacts = [];
      this.friction = Math.sqrt(body1.friction * body2.friction);
    }
    update(old_m) {
      this.contacts.forEach((new_c) => {
        old_m.contacts.forEach((old_c) => {
          if (isEqualId(new_c.id, old_c.id)) {
            new_c.Pn = old_c.Pn;
            new_c.Pt = old_c.Pt;
          }
        });
      });
    }
    preStep(inv_dt) {
      const b1 = this.body1;
      const b2 = this.body2;
      const k_allowedPenetration = 0.01;
      const k_biasFactor = 0.2;
      this.contacts.forEach((c) => {
        const normal = c.normal;
        const tangent = c.normal.perpendicular().neg();
        const r1 = b2SubVV(c.position, b1.position);
        const r2 = b2SubVV(c.position, b2.position);
        const invMass = b1.invMass + b2.invMass;
        const rn1 = b2Dot(r1, normal);
        const rn2 = b2Dot(r2, normal);
        const invN1 = b1.invI * (b2Dot(r1, r1) - rn1 * rn1);
        const invN2 = b2.invI * (b2Dot(r2, r2) - rn2 * rn2);
        const kNormal = b1.invMass + b2.invMass + invN1 + invN2;
        c.massNormal = 1 / kNormal;
        const rt1 = b2Dot(r1, tangent);
        const rt2 = b2Dot(r2, tangent);
        const invT1 = b1.invI * (b2Dot(r1, r1) - rt1 * rt1);
        const invT2 = b2.invI * (b2Dot(r2, r2) - rt2 * rt2);
        const kTangent = b1.invMass + b2.invMass + invT1 + invT2;
        c.massTangent = 1 / kTangent;
        c.bias = -k_biasFactor * inv_dt * Math.min(0, c.separation + k_allowedPenetration);
        const P_u0 = c.Pn * normal.u0 + c.Pt * tangent.u0;
        const P_u1 = c.Pn * normal.u1 + c.Pt * tangent.u1;
        const P = new b2Vec2(P_u0, P_u1);
        b1.applyImpulse(c.position, P.neg());
        b2.applyImpulse(c.position, P);
      });
    }
    applyImpulse() {
      const b1 = this.body1;
      const b2 = this.body2;
      this.contacts.forEach(function(c) {
        const normal = c.normal;
        const tangent = c.normal.perpendicular().neg();
        const vr1 = b1.relativeVelocity(c.position);
        const vr2 = b2.relativeVelocity(c.position);
        const dv = b2SubVV(vr2, vr1);
        const vn = b2Dot(dv, normal);
        const vt = b2Dot(dv, tangent);
        let dPn = c.massNormal * (-vn + c.bias);
        let dPt = c.massTangent * -vt;
        const Pn0 = c.Pn;
        const Pt0 = c.Pt;
        const maxPt = this.friction * c.Pn;
        c.Pn = Math.max(Pn0 + dPn, 0);
        c.Pt = Math.min(Math.max(Pt0 + dPt, -maxPt), maxPt);
        dPn = c.Pn - Pn0;
        dPt = c.Pt - Pt0;
        const P_u0 = dPn * normal.u0 + dPt * tangent.u0;
        const P_u1 = dPn * normal.u1 + dPt * tangent.u1;
        const P = new b2Vec2(P_u0, P_u1);
        b1.applyImpulse(c.position, P.neg());
        b2.applyImpulse(c.position, P);
      }, this);
    }
  };

  // ../../src/b2Collide.ts
  function b2ClipSegment(cv, distance0, distance1, clipEdge, idx) {
    const t = distance0 / (distance0 - distance1);
    cv[idx].v = b2Interp(cv[0].v, cv[1].v, t);
    cv[idx].id[idx + 0] = clipEdge;
    cv[idx].id[idx + 2] = 0;
  }
  function b2ClipSegmentToLine(cv, normal, vx, clipEdge) {
    const distance0 = b2Distance(normal, vx, cv[0].v);
    const distance1 = b2Distance(normal, vx, cv[1].v);
    if (distance0 > 0) {
      b2ClipSegment(cv, distance0, distance1, clipEdge, 0);
    } else if (distance1 > 0) {
      b2ClipSegment(cv, distance0, distance1, clipEdge, 1);
    }
  }
  function b2FindMaxSeparation(poly1, poly2, flip) {
    const count1 = poly1.vertexCount;
    const count2 = poly2.vertexCount;
    const sij = new Array(count2);
    const si = new Array(count1);
    for (let i = 0; i < count1; ++i) {
      const n = poly1.normals[i];
      const v1 = poly1.vertices[i];
      for (let j = 0; j < count2; ++j) {
        sij[j] = b2Distance(n, v1, poly2.vertices[j]);
      }
      si[i] = sij.reduce((min, x) => x < min ? x : min);
    }
    const index = si.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    return {
      poly1,
      poly2,
      maxSeparation: si[index],
      index,
      flip
    };
  }
  function b2FindIncidentEdge(refEdge) {
    const count2 = refEdge.poly2.vertexCount;
    const normal1 = refEdge.poly1.normals[refEdge.index];
    const dots = new Array(count2);
    for (let i = 0; i < count2; ++i) {
      dots[i] = b2Dot(normal1, refEdge.poly2.normals[i]);
    }
    const i1 = dots.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
    const i2 = i1 + 1 < count2 ? i1 + 1 : 0;
    return [
      { v: refEdge.poly2.vertices[i1], id: [0, 0, refEdge.index, i1] },
      { v: refEdge.poly2.vertices[i2], id: [0, 0, refEdge.index, i2] }
    ];
  }
  function b2CollidePoly(polyA, polyB) {
    const edgeA = b2FindMaxSeparation(polyA, polyB, 0);
    if (edgeA.maxSeparation > 0) {
      return;
    }
    const edgeB = b2FindMaxSeparation(polyB, polyA, 1);
    if (edgeB.maxSeparation > 0) {
      return;
    }
    const referenceEdge = edgeB.maxSeparation > edgeA.maxSeparation ? edgeB : edgeA;
    const incidentEdge = b2FindIncidentEdge(referenceEdge);
    const count1 = referenceEdge.poly1.vertexCount;
    const iv1 = referenceEdge.index;
    const iv2 = iv1 + 1 < count1 ? iv1 + 1 : 0;
    const vert1s = referenceEdge.poly1.vertices;
    const norm1s = referenceEdge.poly1.normals;
    const v11 = vert1s[iv1];
    const v12 = vert1s[iv2];
    const normal = norm1s[iv1];
    const perp = normal.perpendicular();
    b2ClipSegmentToLine(incidentEdge, perp, v11, iv1);
    b2ClipSegmentToLine(incidentEdge, perp.neg(), v12, iv2);
    const m = new b2Manifold(polyA, polyB);
    for (let i = 0; i < 2; ++i) {
      const separation = b2Distance(normal, v11, incidentEdge[i].v);
      if (separation <= 0) {
        const cp = new b2ContactPoint();
        cp.separation = separation;
        cp.position = incidentEdge[i].v;
        const id = incidentEdge[i].id;
        if (referenceEdge.flip) {
          cp.normal = normal.neg();
          cp.id = [id[2], id[3], id[0], id[1]];
        } else {
          cp.normal = normal.copy();
          cp.id = [id[0], id[1], id[2], id[3]];
        }
        m.contacts.push(cp);
      }
    }
    return m;
  }

  // ../../src/b2Joint.ts
  var b2Joint = class {
    constructor(body1, body2, anchor) {
      this.body1 = body1;
      this.body2 = body2;
      this.localAnchor1 = body1.localPosition(anchor);
      this.localAnchor2 = body2.localPosition(anchor);
      this.P = new b2Vec2(0, 0);
    }
    preStep(inv_dt) {
      const b1 = this.body1;
      const b2 = this.body2;
      this.r1 = b1.worldPosition(this.localAnchor1);
      this.r2 = b2.worldPosition(this.localAnchor2);
      const r1 = b2SubVV(this.r1, b1.position);
      const r2 = b2SubVV(this.r2, b2.position);
      const invMass = b1.invMass + b2.invMass;
      const invI1 = b1.invI;
      const invI2 = b2.invI;
      const k00 = invI1 * r1.u1 * r1.u1 + invI2 * r2.u1 * r2.u1 + invMass;
      const k01 = invI1 * r1.u0 * r1.u1 + invI2 * r2.u0 * r2.u1;
      const k11 = invI1 * r1.u0 * r1.u0 + invI2 * r2.u0 * r2.u0 + invMass;
      this.M = b2Inverse(k00, -k01, -k01, k11);
      const dp = b2SubVV(this.r2, this.r1);
      const k_biasFactor = 0.2;
      const bias_u0 = -k_biasFactor * inv_dt * (this.r2.u0 - this.r1.u0);
      const bias_u1 = -k_biasFactor * inv_dt * (this.r2.u1 - this.r1.u1);
      this.bias = new b2Vec2(bias_u0, bias_u1);
      b1.applyImpulse(this.r1, this.P.neg());
      b2.applyImpulse(this.r2, this.P);
    }
    applyImpulse() {
      const b1 = this.body1;
      const b2 = this.body2;
      const dv = b2SubVV(
        b2.relativeVelocity(this.r2),
        b1.relativeVelocity(this.r1)
      );
      const d = b2SubVV(this.bias, dv);
      const P_u0 = b2Dot(this.M.v0, d);
      const P_u1 = b2Dot(this.M.v1, d);
      const P = new b2Vec2(P_u0, P_u1);
      b1.applyImpulse(this.r1, P.neg());
      b2.applyImpulse(this.r2, P);
      this.P.set(
        this.P.u0 + P.u0,
        this.P.u1 + P.u1
      );
    }
  };

  // ../../src/b2RigidBody.ts
  var b2RigidBody = class {
    constructor(id, pos, rot, width, mass, invMass, invI) {
      this.id = id;
      this.width = width;
      this.position = pos;
      this.rotation = rot;
      this.velocity = new b2Vec2(0, 0);
      this.angularVelocity = 0;
      this.force = new b2Vec2(0, 0);
      this.torque = 0;
      this.vertexCount = 4;
      this.vertices = new Array(this.vertexCount);
      this.normals = new Array(this.vertexCount);
      for (let i = 0; i < this.vertexCount; i++) {
        this.vertices[i] = new b2Vec2(0, 0);
        this.normals[i] = new b2Vec2(0, 0);
      }
      this.transformShape();
      this.mass = mass;
      this.invMass = invMass;
      this.invI = invI;
      this.friction = 0.2;
      this.restitution = 0;
    }
    localPosition(worldPt) {
      const r_u0 = worldPt.u0 - this.position.u0;
      const r_u1 = worldPt.u1 - this.position.u1;
      const q_s = Math.sin(-this.rotation);
      const q_c = Math.cos(-this.rotation);
      const v_u0 = q_c * r_u0 - q_s * r_u1;
      const v_u1 = q_s * r_u0 + q_c * r_u1;
      return new b2Vec2(v_u0, v_u1);
    }
    worldPosition(localPt) {
      const q_s = Math.sin(this.rotation);
      const q_c = Math.cos(this.rotation);
      const v_u0 = q_c * localPt.u0 - q_s * localPt.u1 + this.position.u0;
      const v_u1 = q_s * localPt.u0 + q_c * localPt.u1 + this.position.u1;
      return new b2Vec2(v_u0, v_u1);
    }
    relativeVelocity(pt) {
      const r_u0 = pt.u0 - this.position.u0;
      const r_u1 = pt.u1 - this.position.u1;
      const av = this.angularVelocity;
      const v_u0 = this.velocity.u0 - av * r_u1;
      const v_u1 = this.velocity.u1 + av * r_u0;
      return new b2Vec2(v_u0, v_u1);
    }
    applyForce(F) {
      this.force.u0 += F.u0;
      this.force.u1 += F.u1;
    }
    applyImpulse(pt, P) {
      const r_u0 = pt.u0 - this.position.u0;
      const r_u1 = pt.u1 - this.position.u1;
      this.velocity.u0 += this.invMass * P.u0;
      this.velocity.u1 += this.invMass * P.u1;
      this.angularVelocity += this.invI * (r_u0 * P.u1 - r_u1 * P.u0);
    }
    integrateForces(dt) {
      this.velocity.u0 += dt * this.invMass * this.force.u0;
      this.velocity.u1 += dt * this.invMass * this.force.u1;
      this.angularVelocity += dt * this.invI * this.torque;
      this.force.u0 = 0;
      this.force.u1 = 0;
      this.torque = 0;
    }
    integrateVelocities(dt) {
      this.position.u0 += dt * this.velocity.u0;
      this.position.u1 += dt * this.velocity.u1;
      this.rotation += dt * this.angularVelocity;
      this.transformShape();
    }
    transformShape() {
      const p = this.position;
      const q_s = Math.sin(this.rotation);
      const q_c = Math.cos(this.rotation);
      const cx = 0.5 * this.width.u0;
      const cy = 0.5 * this.width.u1;
      const shape = [
        { u0: -cx, u1: -cy },
        { u0: cx, u1: -cy },
        { u0: cx, u1: cy },
        { u0: -cx, u1: cy }
      ];
      shape.forEach(function(v, i) {
        const u0 = q_c * v.u0 - q_s * v.u1 + p.u0;
        const u1 = q_s * v.u0 + q_c * v.u1 + p.u1;
        this.vertices[i].set(u0, u1);
      }, this);
      const normals = [
        { u0: 0, u1: -1 },
        { u0: 1, u1: 0 },
        { u0: 0, u1: 1 },
        { u0: -1, u1: 0 }
      ];
      normals.forEach(function(n, i) {
        const u0 = q_c * n.u0 - q_s * n.u1;
        const u1 = q_s * n.u0 + q_c * n.u1;
        this.normals[i].set(u0, u1);
      }, this);
    }
  };

  // ../../src/b2World.ts
  var b2World = class {
    constructor() {
      this.dynamicBodies = [];
      this.staticBodies = [];
      this.joints = [];
      this.manifolds = /* @__PURE__ */ new Map();
    }
    addDynamicBody(obj) {
      const width = obj.width;
      const invMass = 1 / obj.mass;
      const invI = invMass * 12 / (width.u0 * width.u0 + width.u1 * width.u1);
      const body = new b2RigidBody(obj.id, obj.pos, obj.rot, obj.width, obj.mass, invMass, invI);
      this.dynamicBodies.push(body);
      return body;
    }
    addStaticBody(obj) {
      const body = new b2RigidBody(obj.id, obj.pos, obj.rot, obj.width, 0, 0, 0);
      this.staticBodies.push(body);
      return body;
    }
    addJoint(obj) {
      const joint = new b2Joint(obj.b1, obj.b2, obj.anchor);
      this.joints.push(joint);
      return joint;
    }
    step(dt) {
      const inv_dt = 1 / dt;
      this.collisionDetection();
      this.dynamicBodies.forEach((body) => body.applyForce(new b2Vec2(0, -10 * body.mass)));
      this.dynamicBodies.forEach((body) => body.integrateForces(dt));
      this.manifolds.forEach((manifold) => manifold.preStep(inv_dt));
      this.joints.forEach((joint) => joint.preStep(inv_dt));
      for (let i = 0; i < 6; ++i) {
        this.manifolds.forEach((manifold) => manifold.applyImpulse());
        this.joints.forEach((joint) => joint.applyImpulse());
      }
      this.dynamicBodies.forEach((body) => body.integrateVelocities(dt));
    }
    collisionDetection() {
      const manifolds = /* @__PURE__ */ new Map();
      for (let i = 0; i < this.dynamicBodies.length; ++i) {
        for (let j = i + 1; j < this.dynamicBodies.length; ++j) {
          this.collide(manifolds, this.dynamicBodies[i], this.dynamicBodies[j]);
        }
      }
      for (let i = 0; i < this.dynamicBodies.length; ++i) {
        for (let j = 0; j < this.staticBodies.length; ++j) {
          this.collide(manifolds, this.dynamicBodies[i], this.staticBodies[j]);
        }
      }
      this.manifolds = manifolds;
    }
    collide(manifolds, bodyA, bodyB) {
      const new_m = b2CollidePoly(bodyA, bodyB);
      if (new_m != null) {
        const key = bodyA.id + ":" + bodyB.id;
        const old_m = this.manifolds.get(key);
        if (old_m != null) {
          new_m.update(old_m);
        }
        manifolds.set(key, new_m);
      }
    }
  };
  function initWorld() {
    return new b2World();
  }

  // webgl.ts
  function reportError(msg) {
    let div = document.getElementById("canvas");
    div.innerHTML = "<p>" + msg + "</p>";
    div.className = "alert";
  }
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      reportError("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      reportError("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  }
  function initShapeBuffers(gl) {
    const positions = [
      -0.5,
      0.5,
      0.5,
      0.5,
      0.5,
      -0.5,
      -0.5,
      -0.5
    ];
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return {
      position: positionBuffer
    };
  }
  function drawScene(programInfo, bodies) {
    const gl = programInfo.gl;
    const buffers = programInfo.buffers;
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const zoom = 10;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const left = -zoom * aspect;
    const right = zoom * aspect;
    const top = zoom;
    const bottom = -zoom;
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projectionMatrix, left, right, bottom, top, -1, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertex,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertex
    );
    gl.useProgram(programInfo.program);
    const bodyMatrix = glMatrix.mat4.create();
    bodies.forEach(function(body) {
      glMatrix.mat4.fromTranslation(bodyMatrix, [body.position.u0, body.position.u1, 0]);
      glMatrix.mat4.rotateZ(bodyMatrix, bodyMatrix, body.rotation);
      glMatrix.mat4.scale(bodyMatrix, bodyMatrix, [body.width.u0, body.width.u1, 1]);
      glMatrix.mat4.mul(bodyMatrix, projectionMatrix, bodyMatrix);
      gl.uniformMatrix4fv(
        programInfo.uniformLocations.matrix,
        false,
        bodyMatrix
      );
      gl.drawArrays(gl.LINE_LOOP, 0, 4);
    });
  }
  function initGl() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");
    if (gl === null) {
      reportError("Your browser does not support WebGL.");
      return;
    }
    const vsSource = `
    attribute vec4 aVertex;

    uniform mat4 uMatrix;

    void main() {
      gl_Position = uMatrix * aVertex;
    }
  `;
    const fsSource = `
    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const shapeBuffers = initShapeBuffers(gl);
    const programInfo = {
      gl,
      program: shaderProgram,
      buffers: shapeBuffers,
      attribLocations: {
        vertex: gl.getAttribLocation(shaderProgram, "aVertex")
      },
      uniformLocations: {
        matrix: gl.getUniformLocation(shaderProgram, "uMatrix")
      }
    };
    return programInfo;
  }

  // main.ts
  window.demo = initDemo6();
  function initDemo1() {
    let world = initWorld();
    let objs = [];
    objs.push(world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -10 }, rot: 0, width: { u0: 100, u1: 20 } }));
    objs.push(world.addDynamicBody({ id: "box", pos: { u0: 0, u1: 4 }, rot: 0, width: { u0: 1, u1: 1 }, mass: 200 }));
    return { objs, world };
  }
  function initDemo2() {
    let world = initWorld();
    let objs = [];
    objs.push(world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -10 }, rot: 0, width: { u0: 100, u1: 20 } }));
    objs.push(world.addDynamicBody({ id: "b1", pos: { u0: 0, u1: 4 }, rot: 0, width: { u0: 1, u1: 1 }, mass: 200 }));
    objs.push(world.addDynamicBody({ id: "b2", pos: { u0: 0.4, u1: 6 }, rot: 0, width: { u0: 10, u1: 0.1 }, mass: 200 }));
    objs.push(world.addDynamicBody({ id: "b3", pos: { u0: -2, u1: 8 }, rot: 0, width: { u0: 0.5, u1: 0.5 }, mass: 50 }));
    objs.push(world.addDynamicBody({ id: "b4", pos: { u0: -3, u1: 8 }, rot: 0, width: { u0: 0.5, u1: 0.5 }, mass: 50 }));
    objs.push(world.addDynamicBody({ id: "b5", pos: { u0: 2, u1: 12 }, rot: 0, width: { u0: 1, u1: 1 }, mass: 200 }));
    return { objs, world };
  }
  function initDemo3() {
    let world = initWorld();
    let objs = [];
    objs.push(world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -14 }, rot: 0, width: { u0: 100, u1: 20 } }));
    objs.push(world.addStaticBody({ id: "frm1", pos: { u0: -2, u1: 7 }, rot: -0.25, width: { u0: 13, u1: 0.25 } }));
    objs.push(world.addStaticBody({ id: "frm2", pos: { u0: 2, u1: 3 }, rot: 0.25, width: { u0: 13, u1: 0.25 } }));
    objs.push(world.addStaticBody({ id: "frm3", pos: { u0: -2, u1: -1 }, rot: -0.25, width: { u0: 13, u1: 0.25 } }));
    objs.push(world.addStaticBody({ id: "stp1", pos: { u0: 5.25, u1: 5.5 }, rot: 0, width: { u0: 0.25, u1: 1 } }));
    objs.push(world.addStaticBody({ id: "stp2", pos: { u0: -5.25, u1: 1.5 }, rot: 0, width: { u0: 0.25, u1: 1 } }));
    const friction = [0.75, 0.5, 0.35, 0.1, 0];
    for (let i = 0; i < 5; i++) {
      let obj = world.addDynamicBody({ id: "b" + i, pos: { u0: -7.5 + 2 * i, u1: 10 }, rot: 0, width: { u0: 0.5, u1: 0.5 }, mass: 25 });
      obj.friction = friction[i];
      objs.push(obj);
    }
    return { objs, world };
  }
  function initDemo4() {
    let world = initWorld();
    let objs = [];
    objs.push(world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -14 }, rot: 0, width: { u0: 100, u1: 20 } }));
    for (let i = 0; i < 10; i++) {
      let x = Math.random() * 0.2 - 0.1;
      objs.push(world.addDynamicBody({ id: "b" + i, pos: { u0: x, u1: -4 + 0.51 + 1.05 * i }, rot: 0, width: { u0: 1, u1: 1 }, mass: 1 }));
    }
    return { objs, world };
  }
  function initDemo5() {
    let world = initWorld();
    let objs = [];
    objs.push(world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -14 }, rot: 0, width: { u0: 100, u1: 20 } }));
    for (let i = 0; i < 12; i++) {
      let x = -6 + i * 0.5625;
      for (let j = i; j < 12; j++) {
        objs.push(world.addDynamicBody({ id: "r" + i + "c" + j, pos: { u0: x, u1: 0.75 + 2 * i }, rot: 0, width: { u0: 1, u1: 1 }, mass: 10 }));
        x += 1.125;
      }
    }
    return { objs, world };
  }
  function initDemo6() {
    let world = initWorld();
    let objs = [];
    let gnd = world.addStaticBody({ id: "gnd", pos: { u0: 0, u1: -14 }, rot: 0, width: { u0: 100, u1: 20 } });
    let pdl = world.addDynamicBody({ id: "pdl", pos: { u0: 9, u1: 11 }, rot: 0, width: { u0: 1, u1: 1 }, mass: 100 });
    objs.push(gnd);
    objs.push(pdl);
    world.addJoint({ b1: gnd, b2: pdl, anchor: { u0: 0, u1: 11 } });
    return { objs, world };
  }
  function main() {
    let wgl = initGl();
    let prev_t_sec = 0;
    function render(t_msec) {
      const t_sec = t_msec * 1e-3;
      const dt = t_sec - prev_t_sec;
      prev_t_sec = t_sec;
      for (let i = 0; i < 4; i++) {
        window.demo.world.step(0.01);
      }
      drawScene(wgl, window.demo.objs);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }
  window.initDemo1 = initDemo1;
  window.initDemo2 = initDemo2;
  window.initDemo3 = initDemo3;
  window.initDemo4 = initDemo4;
  window.initDemo5 = initDemo5;
  window.initDemo6 = initDemo6;
  main();
})();
