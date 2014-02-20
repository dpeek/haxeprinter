(function () { "use strict";
var $estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = true;
List.prototype = {
	push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) return s;
	while(s.length < l) s = c + s;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var byte = {};
byte._LittleEndianReader = {};
byte._LittleEndianReader.LittleEndianReader_Impl_ = function() { };
byte._LittleEndianReader.LittleEndianReader_Impl_.__name__ = true;
byte._LittleEndianReader.LittleEndianReader_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt8 = function(this1,pos) {
	var n = this1[pos];
	if(n >= 128) return n - 256;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt8 = function(this1,pos) {
	return this1[pos];
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var n = ch1 | ch2 << 8;
	if((n & 32768) != 0) return n - 65536;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt16 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	return ch1 | ch2 << 8;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var n = ch1 | ch2 << 8 | ch3 << 16;
	if((n & 8388608) != 0) return n - 16777216;
	return n;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readUInt24 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	return ch1 | ch2 << 8 | ch3 << 16;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readInt32 = function(this1,pos) {
	var ch1 = this1[pos];
	var ch2 = this1[pos + 1];
	var ch3 = this1[pos + 2];
	var ch4 = this1[pos + 3];
	return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readString = function(this1,pos,len) {
	return byte.js._ByteData.ByteData_Impl_.readString(this1,pos,len);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readFloat = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
	var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
	if(sig == 0 && exp == -127) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.readDouble = function(this1,pos) {
	var bytes = [];
	bytes.push(this1[pos]);
	bytes.push(this1[pos + 1]);
	bytes.push(this1[pos + 2]);
	bytes.push(this1[pos + 3]);
	bytes.push(this1[pos + 4]);
	bytes.push(this1[pos + 5]);
	bytes.push(this1[pos + 6]);
	bytes.push(this1[pos + 7]);
	var sign = 1 - (bytes[0] >> 7 << 1);
	var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
	var sig = byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig(this1,bytes);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
byte._LittleEndianReader.LittleEndianReader_Impl_.getDoubleSig = function(this1,bytes) {
	return ((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * 4294967296. + (bytes[4] >> 7) * 2147483648 + ((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]);
};
byte._LittleEndianWriter = {};
byte._LittleEndianWriter.LittleEndianWriter_Impl_ = function() { };
byte._LittleEndianWriter.LittleEndianWriter_Impl_.__name__ = true;
byte._LittleEndianWriter.LittleEndianWriter_Impl_._new = function(data) {
	return data;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt8 = function(this1,pos,x) {
	if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt8 = function(this1,pos,x) {
	this1[pos] = x & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt16 = function(this1,pos,x) {
	if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16(this1,pos,x & 65535);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt16 = function(this1,pos,x) {
	if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt24 = function(this1,pos,x) {
	if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
	byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24(this1,pos,x & 16777215);
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeUInt24 = function(this1,pos,x) {
	if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeInt32 = function(this1,pos,x) {
	this1[pos] = x & 255 & 255;
	this1[pos + 1] = x >> 8 & 255 & 255;
	this1[pos + 2] = x >> 16 & 255 & 255;
	this1[pos + 3] = x >>> 24 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeFloat = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
	var b1;
	b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 127 << 7 & 255 | sig >> 16 & 127;
	var b3 = sig >> 8 & 255;
	var b4 = sig & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
};
byte._LittleEndianWriter.LittleEndianWriter_Impl_.writeDouble = function(this1,pos,x) {
	if(x == 0.0) {
		this1[pos] = 0;
		this1[pos + 1] = 0;
		this1[pos + 2] = 0;
		this1[pos + 3] = 0;
		this1[pos + 4] = 0;
		this1[pos + 5] = 0;
		this1[pos + 6] = 0;
		this1[pos + 7] = 0;
		return;
	}
	var exp = Math.floor(Math.log(Math.abs(x)) / byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2);
	var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
	var sig_h = sig & 34359738367;
	var sig_l = Math.floor(sig / Math.pow(2,32));
	var b1;
	b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0);
	var b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15;
	var b3 = sig_l >> 8 & 255;
	var b4 = sig_l & 255;
	var b5 = sig_h >> 24 & 255;
	var b6 = sig_h >> 16 & 255;
	var b7 = sig_h >> 8 & 255;
	var b8 = sig_h & 255;
	this1[pos] = b1 & 255;
	this1[pos + 1] = b2 & 255;
	this1[pos + 2] = b3 & 255;
	this1[pos + 3] = b4 & 255;
	this1[pos + 4] = b5 & 255;
	this1[pos + 5] = b6 & 255;
	this1[pos + 6] = b7 & 255;
	this1[pos + 7] = b8 & 255;
};
byte.js = {};
byte.js._ByteData = {};
byte.js._ByteData.ByteData_Impl_ = function() { };
byte.js._ByteData.ByteData_Impl_.__name__ = true;
byte.js._ByteData.ByteData_Impl_.get_length = function(this1) {
	return this1.length;
};
byte.js._ByteData.ByteData_Impl_.get_reader = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_.get_writer = function(this1) {
	return this1;
};
byte.js._ByteData.ByteData_Impl_._new = function(data) {
	return data;
};
byte.js._ByteData.ByteData_Impl_.readByte = function(this1,pos) {
	return this1[pos];
};
byte.js._ByteData.ByteData_Impl_.writeByte = function(this1,pos,v) {
	this1[pos] = v & 255;
};
byte.js._ByteData.ByteData_Impl_.readString = function(this1,pos,len) {
	var buf = new StringBuf();
	var _g1 = pos;
	var _g = pos + len;
	while(_g1 < _g) {
		var i = _g1++;
		buf.b += String.fromCharCode(this1[i]);
	}
	return buf.b;
};
byte.js._ByteData.ByteData_Impl_.alloc = function(length) {
	var b = new Int8Array(length);
	return b;
};
byte.js._ByteData.ByteData_Impl_.ofString = function(s) {
	var a = new Int8Array(s.length);
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = s.charCodeAt(i);
	}
	return a;
};
var haxe = {};
haxe.Resource = function() { };
haxe.Resource.__name__ = true;
haxe.Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe.Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) return x.str;
			var b = haxe.crypto.Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0;
	var _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
};
haxe.io.Bytes.prototype = {
	readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c21 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,__class__: haxe.io.Bytes
};
haxe.crypto = {};
haxe.crypto.Base64 = function() { };
haxe.crypto.Base64.__name__ = true;
haxe.crypto.Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe.crypto.BaseCode(haxe.crypto.Base64.BYTES).decodeBytes(haxe.io.Bytes.ofString(str));
};
haxe.crypto.BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw "BaseCode : base length must be a power of two.";
	this.base = base;
	this.nbits = nbits;
};
haxe.crypto.BaseCode.__name__ = true;
haxe.crypto.BaseCode.prototype = {
	initTable: function() {
		var tbl = new Array();
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe.io.Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[(function($this) {
					var $r;
					var pos = pin++;
					$r = b.b[pos];
					return $r;
				}(this))];
				if(i == -1) throw "BaseCode : invalid encoded char";
				buf |= i;
			}
			curbits -= 8;
			var pos1 = pout++;
			out.b[pos1] = buf >> curbits & 255 & 255;
		}
		return out;
	}
	,__class__: haxe.crypto.BaseCode
};
haxe.ds = {};
haxe.ds.GenericCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
haxe.ds.GenericCell.__name__ = true;
haxe.ds.GenericCell.prototype = {
	__class__: haxe.ds.GenericCell
};
haxe.ds.Option = { __ename__ : true, __constructs__ : ["Some","None"] };
haxe.ds.Option.Some = function(v) { var $x = ["Some",0,v]; $x.__enum__ = haxe.ds.Option; $x.toString = $estr; return $x; };
haxe.ds.Option.None = ["None",1];
haxe.ds.Option.None.toString = $estr;
haxe.ds.Option.None.__enum__ = haxe.ds.Option;
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,__class__: haxe.ds.StringMap
};
haxe.io.Eof = function() {
};
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
haxe.io.Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; };
haxe.macro = {};
haxe.macro.Constant = { __ename__ : true, __constructs__ : ["CInt","CFloat","CString","CIdent","CRegexp"] };
haxe.macro.Constant.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CIdent = function(s) { var $x = ["CIdent",3,s]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Constant.CRegexp = function(r,opt) { var $x = ["CRegexp",4,r,opt]; $x.__enum__ = haxe.macro.Constant; $x.toString = $estr; return $x; };
haxe.macro.Binop = { __ename__ : true, __constructs__ : ["OpAdd","OpMult","OpDiv","OpSub","OpAssign","OpEq","OpNotEq","OpGt","OpGte","OpLt","OpLte","OpAnd","OpOr","OpXor","OpBoolAnd","OpBoolOr","OpShl","OpShr","OpUShr","OpMod","OpAssignOp","OpInterval","OpArrow"] };
haxe.macro.Binop.OpAdd = ["OpAdd",0];
haxe.macro.Binop.OpAdd.toString = $estr;
haxe.macro.Binop.OpAdd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMult = ["OpMult",1];
haxe.macro.Binop.OpMult.toString = $estr;
haxe.macro.Binop.OpMult.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpDiv = ["OpDiv",2];
haxe.macro.Binop.OpDiv.toString = $estr;
haxe.macro.Binop.OpDiv.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpSub = ["OpSub",3];
haxe.macro.Binop.OpSub.toString = $estr;
haxe.macro.Binop.OpSub.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssign = ["OpAssign",4];
haxe.macro.Binop.OpAssign.toString = $estr;
haxe.macro.Binop.OpAssign.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpEq = ["OpEq",5];
haxe.macro.Binop.OpEq.toString = $estr;
haxe.macro.Binop.OpEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpNotEq = ["OpNotEq",6];
haxe.macro.Binop.OpNotEq.toString = $estr;
haxe.macro.Binop.OpNotEq.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGt = ["OpGt",7];
haxe.macro.Binop.OpGt.toString = $estr;
haxe.macro.Binop.OpGt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpGte = ["OpGte",8];
haxe.macro.Binop.OpGte.toString = $estr;
haxe.macro.Binop.OpGte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLt = ["OpLt",9];
haxe.macro.Binop.OpLt.toString = $estr;
haxe.macro.Binop.OpLt.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpLte = ["OpLte",10];
haxe.macro.Binop.OpLte.toString = $estr;
haxe.macro.Binop.OpLte.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAnd = ["OpAnd",11];
haxe.macro.Binop.OpAnd.toString = $estr;
haxe.macro.Binop.OpAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpOr = ["OpOr",12];
haxe.macro.Binop.OpOr.toString = $estr;
haxe.macro.Binop.OpOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpXor = ["OpXor",13];
haxe.macro.Binop.OpXor.toString = $estr;
haxe.macro.Binop.OpXor.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolAnd = ["OpBoolAnd",14];
haxe.macro.Binop.OpBoolAnd.toString = $estr;
haxe.macro.Binop.OpBoolAnd.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpBoolOr = ["OpBoolOr",15];
haxe.macro.Binop.OpBoolOr.toString = $estr;
haxe.macro.Binop.OpBoolOr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShl = ["OpShl",16];
haxe.macro.Binop.OpShl.toString = $estr;
haxe.macro.Binop.OpShl.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpShr = ["OpShr",17];
haxe.macro.Binop.OpShr.toString = $estr;
haxe.macro.Binop.OpShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpUShr = ["OpUShr",18];
haxe.macro.Binop.OpUShr.toString = $estr;
haxe.macro.Binop.OpUShr.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpMod = ["OpMod",19];
haxe.macro.Binop.OpMod.toString = $estr;
haxe.macro.Binop.OpMod.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpAssignOp = function(op) { var $x = ["OpAssignOp",20,op]; $x.__enum__ = haxe.macro.Binop; $x.toString = $estr; return $x; };
haxe.macro.Binop.OpInterval = ["OpInterval",21];
haxe.macro.Binop.OpInterval.toString = $estr;
haxe.macro.Binop.OpInterval.__enum__ = haxe.macro.Binop;
haxe.macro.Binop.OpArrow = ["OpArrow",22];
haxe.macro.Binop.OpArrow.toString = $estr;
haxe.macro.Binop.OpArrow.__enum__ = haxe.macro.Binop;
haxe.macro.Unop = { __ename__ : true, __constructs__ : ["OpIncrement","OpDecrement","OpNot","OpNeg","OpNegBits"] };
haxe.macro.Unop.OpIncrement = ["OpIncrement",0];
haxe.macro.Unop.OpIncrement.toString = $estr;
haxe.macro.Unop.OpIncrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpDecrement = ["OpDecrement",1];
haxe.macro.Unop.OpDecrement.toString = $estr;
haxe.macro.Unop.OpDecrement.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNot = ["OpNot",2];
haxe.macro.Unop.OpNot.toString = $estr;
haxe.macro.Unop.OpNot.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNeg = ["OpNeg",3];
haxe.macro.Unop.OpNeg.toString = $estr;
haxe.macro.Unop.OpNeg.__enum__ = haxe.macro.Unop;
haxe.macro.Unop.OpNegBits = ["OpNegBits",4];
haxe.macro.Unop.OpNegBits.toString = $estr;
haxe.macro.Unop.OpNegBits.__enum__ = haxe.macro.Unop;
haxe.macro.ExprDef = { __ename__ : true, __constructs__ : ["EConst","EArray","EBinop","EField","EParenthesis","EObjectDecl","EArrayDecl","ECall","ENew","EUnop","EVars","EFunction","EBlock","EFor","EIn","EIf","EWhile","ESwitch","ETry","EReturn","EBreak","EContinue","EUntyped","EThrow","ECast","EDisplay","EDisplayNew","ETernary","ECheckType","EMeta"] };
haxe.macro.ExprDef.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArray = function(e1,e2) { var $x = ["EArray",1,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBinop = function(op,e1,e2) { var $x = ["EBinop",2,op,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EField = function(e,field) { var $x = ["EField",3,e,field]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EParenthesis = function(e) { var $x = ["EParenthesis",4,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EObjectDecl = function(fields) { var $x = ["EObjectDecl",5,fields]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EArrayDecl = function(values) { var $x = ["EArrayDecl",6,values]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECall = function(e,params) { var $x = ["ECall",7,e,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ENew = function(t,params) { var $x = ["ENew",8,t,params]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EUnop = function(op,postFix,e) { var $x = ["EUnop",9,op,postFix,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EVars = function(vars) { var $x = ["EVars",10,vars]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFunction = function(name,f) { var $x = ["EFunction",11,name,f]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBlock = function(exprs) { var $x = ["EBlock",12,exprs]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EFor = function(it,expr) { var $x = ["EFor",13,it,expr]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIn = function(e1,e2) { var $x = ["EIn",14,e1,e2]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EIf = function(econd,eif,eelse) { var $x = ["EIf",15,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EWhile = function(econd,e,normalWhile) { var $x = ["EWhile",16,econd,e,normalWhile]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ESwitch = function(e,cases,edef) { var $x = ["ESwitch",17,e,cases,edef]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETry = function(e,catches) { var $x = ["ETry",18,e,catches]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EReturn = function(e) { var $x = ["EReturn",19,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EBreak = ["EBreak",20];
haxe.macro.ExprDef.EBreak.toString = $estr;
haxe.macro.ExprDef.EBreak.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EContinue = ["EContinue",21];
haxe.macro.ExprDef.EContinue.toString = $estr;
haxe.macro.ExprDef.EContinue.__enum__ = haxe.macro.ExprDef;
haxe.macro.ExprDef.EUntyped = function(e) { var $x = ["EUntyped",22,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EThrow = function(e) { var $x = ["EThrow",23,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECast = function(e,t) { var $x = ["ECast",24,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplay = function(e,isCall) { var $x = ["EDisplay",25,e,isCall]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EDisplayNew = function(t) { var $x = ["EDisplayNew",26,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ETernary = function(econd,eif,eelse) { var $x = ["ETernary",27,econd,eif,eelse]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.ECheckType = function(e,t) { var $x = ["ECheckType",28,e,t]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ExprDef.EMeta = function(s,e) { var $x = ["EMeta",29,s,e]; $x.__enum__ = haxe.macro.ExprDef; $x.toString = $estr; return $x; };
haxe.macro.ComplexType = { __ename__ : true, __constructs__ : ["TPath","TFunction","TAnonymous","TParent","TExtend","TOptional"] };
haxe.macro.ComplexType.TPath = function(p) { var $x = ["TPath",0,p]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TFunction = function(args,ret) { var $x = ["TFunction",1,args,ret]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TAnonymous = function(fields) { var $x = ["TAnonymous",2,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TParent = function(t) { var $x = ["TParent",3,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TExtend = function(p,fields) { var $x = ["TExtend",4,p,fields]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.ComplexType.TOptional = function(t) { var $x = ["TOptional",5,t]; $x.__enum__ = haxe.macro.ComplexType; $x.toString = $estr; return $x; };
haxe.macro.TypeParam = { __ename__ : true, __constructs__ : ["TPType","TPExpr"] };
haxe.macro.TypeParam.TPType = function(t) { var $x = ["TPType",0,t]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.TypeParam.TPExpr = function(e) { var $x = ["TPExpr",1,e]; $x.__enum__ = haxe.macro.TypeParam; $x.toString = $estr; return $x; };
haxe.macro.Access = { __ename__ : true, __constructs__ : ["APublic","APrivate","AStatic","AOverride","ADynamic","AInline","AMacro"] };
haxe.macro.Access.APublic = ["APublic",0];
haxe.macro.Access.APublic.toString = $estr;
haxe.macro.Access.APublic.__enum__ = haxe.macro.Access;
haxe.macro.Access.APrivate = ["APrivate",1];
haxe.macro.Access.APrivate.toString = $estr;
haxe.macro.Access.APrivate.__enum__ = haxe.macro.Access;
haxe.macro.Access.AStatic = ["AStatic",2];
haxe.macro.Access.AStatic.toString = $estr;
haxe.macro.Access.AStatic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AOverride = ["AOverride",3];
haxe.macro.Access.AOverride.toString = $estr;
haxe.macro.Access.AOverride.__enum__ = haxe.macro.Access;
haxe.macro.Access.ADynamic = ["ADynamic",4];
haxe.macro.Access.ADynamic.toString = $estr;
haxe.macro.Access.ADynamic.__enum__ = haxe.macro.Access;
haxe.macro.Access.AInline = ["AInline",5];
haxe.macro.Access.AInline.toString = $estr;
haxe.macro.Access.AInline.__enum__ = haxe.macro.Access;
haxe.macro.Access.AMacro = ["AMacro",6];
haxe.macro.Access.AMacro.toString = $estr;
haxe.macro.Access.AMacro.__enum__ = haxe.macro.Access;
haxe.macro.FieldType = { __ename__ : true, __constructs__ : ["FVar","FFun","FProp"] };
haxe.macro.FieldType.FVar = function(t,e) { var $x = ["FVar",0,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.FieldType.FFun = function(f) { var $x = ["FFun",1,f]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.FieldType.FProp = function(get,set,t,e) { var $x = ["FProp",2,get,set,t,e]; $x.__enum__ = haxe.macro.FieldType; $x.toString = $estr; return $x; };
haxe.macro.ExprTools = function() { };
haxe.macro.ExprTools.__name__ = true;
haxe.macro.ExprTools.toString = function(e) {
	return new haxe.macro.Printer().printExpr(e);
};
haxe.macro.Printer = function(tabString) {
	if(tabString == null) tabString = "\t";
	this.tabs = "";
	this.tabString = tabString;
};
haxe.macro.Printer.__name__ = true;
haxe.macro.Printer.prototype = {
	printUnop: function(op) {
		switch(op[1]) {
		case 0:
			return "++";
		case 1:
			return "--";
		case 2:
			return "!";
		case 3:
			return "-";
		case 4:
			return "~";
		}
	}
	,printBinop: function(op) {
		switch(op[1]) {
		case 0:
			return "+";
		case 1:
			return "*";
		case 2:
			return "/";
		case 3:
			return "-";
		case 4:
			return "=";
		case 5:
			return "==";
		case 6:
			return "!=";
		case 7:
			return ">";
		case 8:
			return ">=";
		case 9:
			return "<";
		case 10:
			return "<=";
		case 11:
			return "&";
		case 12:
			return "|";
		case 13:
			return "^";
		case 14:
			return "&&";
		case 15:
			return "||";
		case 16:
			return "<<";
		case 17:
			return ">>";
		case 18:
			return ">>>";
		case 19:
			return "%";
		case 21:
			return "...";
		case 22:
			return "=>";
		case 20:
			var op1 = op[2];
			return this.printBinop(op1) + "=";
		}
	}
	,printString: function(s) {
		return "\"" + s.split("\n").join("\\n").split("\t").join("\\t").split("'").join("\\'").split("\"").join("\\\"") + "\"";
	}
	,printConstant: function(c) {
		switch(c[1]) {
		case 2:
			var s = c[2];
			return this.printString(s);
		case 3:
			var s1 = c[2];
			return s1;
		case 0:
			var s1 = c[2];
			return s1;
		case 1:
			var s1 = c[2];
			return s1;
		case 4:
			var opt = c[3];
			var s2 = c[2];
			return "~/" + s2 + "/" + opt;
		}
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var ct = param[2];
			return this.printComplexType(ct);
		case 1:
			var e = param[2];
			return this.printExpr(e);
		}
	}
	,printTypePath: function(tp) {
		return (tp.pack.length > 0?tp.pack.join(".") + ".":"") + tp.name + (tp.sub != null?"." + tp.sub:"") + (tp.params.length > 0?"<" + tp.params.map($bind(this,this.printTypeParam)).join(", ") + ">":"");
	}
	,printComplexType: function(ct) {
		switch(ct[1]) {
		case 0:
			var tp = ct[2];
			return this.printTypePath(tp);
		case 1:
			var ret = ct[3];
			var args = ct[2];
			return (args.length > 0?args.map($bind(this,this.printComplexType)).join(" -> "):"Void") + " -> " + this.printComplexType(ret);
		case 2:
			var fields = ct[2];
			return "{ " + ((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < fields.length) {
						var f = fields[_g1];
						++_g1;
						_g.push($this.printField(f) + "; ");
					}
				}
				$r = _g;
				return $r;
			}(this))).join("") + "}";
		case 3:
			var ct1 = ct[2];
			return "(" + this.printComplexType(ct1) + ")";
		case 5:
			var ct2 = ct[2];
			return "?" + this.printComplexType(ct2);
		case 4:
			var fields1 = ct[3];
			var tpl = ct[2];
			return "{> " + tpl.map($bind(this,this.printTypePath)).join(" >, ") + ", " + fields1.map($bind(this,this.printField)).join(", ") + " }";
		}
	}
	,printMetadata: function(meta) {
		return "@" + meta.name + (meta.params.length > 0?"(" + this.printExprs(meta.params,", ") + ")":"");
	}
	,printAccess: function(access) {
		switch(access[1]) {
		case 2:
			return "static";
		case 0:
			return "public";
		case 1:
			return "private";
		case 3:
			return "override";
		case 5:
			return "inline";
		case 4:
			return "dynamic";
		case 6:
			return "macro";
		}
	}
	,printField: function(field) {
		return (field.doc != null && field.doc != ""?"/**\n" + this.tabs + this.tabString + StringTools.replace(field.doc,"\n","\n" + this.tabs + this.tabString) + "\n" + this.tabs + "**/\n" + this.tabs:"") + (field.meta != null && field.meta.length > 0?field.meta.map($bind(this,this.printMetadata)).join("\n" + this.tabs) + ("\n" + this.tabs):"") + (field.access != null && field.access.length > 0?field.access.map($bind(this,this.printAccess)).join(" ") + " ":"") + (function($this) {
			var $r;
			var _g = field.kind;
			$r = (function($this) {
				var $r;
				switch(_g[1]) {
				case 0:
					$r = (function($this) {
						var $r;
						var eo = _g[3];
						var t = _g[2];
						$r = "var " + field.name + $this.opt(t,$bind($this,$this.printComplexType)," : ") + $this.opt(eo,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 2:
					$r = (function($this) {
						var $r;
						var eo1 = _g[5];
						var t1 = _g[4];
						var set = _g[3];
						var get = _g[2];
						$r = "var " + field.name + "(" + get + ", " + set + ")" + $this.opt(t1,$bind($this,$this.printComplexType)," : ") + $this.opt(eo1,$bind($this,$this.printExpr)," = ");
						return $r;
					}($this));
					break;
				case 1:
					$r = (function($this) {
						var $r;
						var func = _g[2];
						$r = "function " + field.name + $this.printFunction(func);
						return $r;
					}($this));
					break;
				}
				return $r;
			}($this));
			return $r;
		}(this));
	}
	,printTypeParamDecl: function(tpd) {
		return tpd.name + (tpd.params != null && tpd.params.length > 0?"<" + tpd.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + (tpd.constraints != null && tpd.constraints.length > 0?":(" + tpd.constraints.map($bind(this,this.printComplexType)).join(", ") + ")":"");
	}
	,printFunctionArg: function(arg) {
		return (arg.opt?"?":"") + arg.name + this.opt(arg.type,$bind(this,this.printComplexType),":") + this.opt(arg.value,$bind(this,this.printExpr)," = ");
	}
	,printFunction: function(func) {
		return (func.params.length > 0?"<" + func.params.map($bind(this,this.printTypeParamDecl)).join(", ") + ">":"") + "(" + func.args.map($bind(this,this.printFunctionArg)).join(", ") + ")" + this.opt(func.ret,$bind(this,this.printComplexType),":") + this.opt(func.expr,$bind(this,this.printExpr)," ");
	}
	,printVar: function(v) {
		return v.name + this.opt(v.type,$bind(this,this.printComplexType),":") + this.opt(v.expr,$bind(this,this.printExpr)," = ");
	}
	,printExpr: function(e) {
		var _g1 = this;
		if(e == null) return "#NULL"; else {
			var _g = e.expr;
			switch(_g[1]) {
			case 0:
				var c = _g[2];
				return this.printConstant(c);
			case 1:
				var e2 = _g[3];
				var e1 = _g[2];
				return "" + this.printExpr(e1) + "[" + this.printExpr(e2) + "]";
			case 2:
				var e21 = _g[4];
				var e11 = _g[3];
				var op = _g[2];
				return "" + this.printExpr(e11) + " " + this.printBinop(op) + " " + this.printExpr(e21);
			case 3:
				var n = _g[3];
				var e12 = _g[2];
				return "" + this.printExpr(e12) + "." + n;
			case 4:
				var e13 = _g[2];
				return "(" + this.printExpr(e13) + ")";
			case 5:
				var fl = _g[2];
				return "{ " + fl.map(function(fld) {
					return "" + fld.field + " : " + _g1.printExpr(fld.expr);
				}).join(", ") + " }";
			case 6:
				var el = _g[2];
				return "[" + this.printExprs(el,", ") + "]";
			case 7:
				var el1 = _g[3];
				var e14 = _g[2];
				return "" + this.printExpr(e14) + "(" + this.printExprs(el1,", ") + ")";
			case 8:
				var el2 = _g[3];
				var tp = _g[2];
				return "new " + this.printTypePath(tp) + "(" + this.printExprs(el2,", ") + ")";
			case 9:
				switch(_g[3]) {
				case true:
					var e15 = _g[4];
					var op1 = _g[2];
					return this.printExpr(e15) + this.printUnop(op1);
				case false:
					var e16 = _g[4];
					var op2 = _g[2];
					return this.printUnop(op2) + this.printExpr(e16);
				}
				break;
			case 11:
				var func = _g[3];
				var no = _g[2];
				if(no != null) return "function " + no + this.printFunction(func); else {
					var func1 = _g[3];
					return "function" + this.printFunction(func1);
				}
				break;
			case 10:
				var vl = _g[2];
				return "var " + vl.map($bind(this,this.printVar)).join(", ");
			case 12:
				var el3 = _g[2];
				switch(_g[2].length) {
				case 0:
					return "{ }";
				default:
					var old = this.tabs;
					this.tabs += this.tabString;
					var s = "{\n" + this.tabs + this.printExprs(el3,";\n" + this.tabs);
					this.tabs = old;
					return s + (";\n" + this.tabs + "}");
				}
				break;
			case 13:
				var e22 = _g[3];
				var e17 = _g[2];
				return "for (" + this.printExpr(e17) + ") " + this.printExpr(e22);
			case 14:
				var e23 = _g[3];
				var e18 = _g[2];
				return "" + this.printExpr(e18) + " in " + this.printExpr(e23);
			case 15:
				var eelse = _g[4];
				if(_g[4] == null) {
					var econd = _g[2];
					var eif = _g[3];
					return "if (" + this.printExpr(econd) + ") " + this.printExpr(eif);
				} else switch(_g[4]) {
				default:
					var econd1 = _g[2];
					var eif1 = _g[3];
					return "if (" + this.printExpr(econd1) + ") " + this.printExpr(eif1) + " else " + this.printExpr(eelse);
				}
				break;
			case 16:
				switch(_g[4]) {
				case true:
					var econd2 = _g[2];
					var e19 = _g[3];
					return "while (" + this.printExpr(econd2) + ") " + this.printExpr(e19);
				case false:
					var econd3 = _g[2];
					var e110 = _g[3];
					return "do " + this.printExpr(e110) + " while (" + this.printExpr(econd3) + ")";
				}
				break;
			case 17:
				var edef = _g[4];
				var cl = _g[3];
				var e111 = _g[2];
				var old1 = this.tabs;
				this.tabs += this.tabString;
				var s1 = "switch " + this.printExpr(e111) + " {\n" + this.tabs + cl.map(function(c1) {
					return "case " + _g1.printExprs(c1.values,", ") + (c1.guard != null?" if(" + _g1.printExpr(c1.guard) + "): ":":") + (c1.expr != null?_g1.opt(c1.expr,$bind(_g1,_g1.printExpr)) + ";":"");
				}).join("\n" + this.tabs);
				if(edef != null) s1 += "\n" + this.tabs + "default: " + (edef.expr == null?"":this.printExpr(edef) + ";");
				this.tabs = old1;
				return s1 + ("\n" + this.tabs + "}");
			case 18:
				var cl1 = _g[3];
				var e112 = _g[2];
				return "try " + this.printExpr(e112) + cl1.map(function(c2) {
					return " catch(" + c2.name + ":" + _g1.printComplexType(c2.type) + ") " + _g1.printExpr(c2.expr);
				}).join("");
			case 19:
				var eo = _g[2];
				return "return" + this.opt(eo,$bind(this,this.printExpr)," ");
			case 20:
				return "break";
			case 21:
				return "continue";
			case 22:
				var e113 = _g[2];
				return "untyped " + this.printExpr(e113);
			case 23:
				var e114 = _g[2];
				return "throw " + this.printExpr(e114);
			case 24:
				var cto = _g[3];
				var e115 = _g[2];
				if(cto != null) return "cast(" + this.printExpr(e115) + ", " + this.printComplexType(cto) + ")"; else {
					var e116 = _g[2];
					return "cast " + this.printExpr(e116);
				}
				break;
			case 25:
				var e117 = _g[2];
				return "#DISPLAY(" + this.printExpr(e117) + ")";
			case 26:
				var tp1 = _g[2];
				return "#DISPLAY(" + this.printTypePath(tp1) + ")";
			case 27:
				var eelse1 = _g[4];
				var eif2 = _g[3];
				var econd4 = _g[2];
				return "" + this.printExpr(econd4) + " ? " + this.printExpr(eif2) + " : " + this.printExpr(eelse1);
			case 28:
				var ct = _g[3];
				var e118 = _g[2];
				return "(" + this.printExpr(e118) + " : " + this.printComplexType(ct) + ")";
			case 29:
				var e119 = _g[3];
				var meta = _g[2];
				return this.printMetadata(meta) + " " + this.printExpr(e119);
			}
		}
	}
	,printExprs: function(el,sep) {
		return el.map($bind(this,this.printExpr)).join(sep);
	}
	,opt: function(v,f,prefix) {
		if(prefix == null) prefix = "";
		if(v == null) return ""; else return prefix + f(v);
	}
	,__class__: haxe.macro.Printer
};
var haxeparser = {};
haxeparser.Keyword = { __ename__ : true, __constructs__ : ["KwdFunction","KwdClass","KwdVar","KwdIf","KwdElse","KwdWhile","KwdDo","KwdFor","KwdBreak","KwdContinue","KwdReturn","KwdExtends","KwdImplements","KwdImport","KwdSwitch","KwdCase","KwdDefault","KwdStatic","KwdPublic","KwdPrivate","KwdTry","KwdCatch","KwdNew","KwdThis","KwdThrow","KwdExtern","KwdEnum","KwdIn","KwdInterface","KwdUntyped","KwdCast","KwdOverride","KwdTypedef","KwdDynamic","KwdPackage","KwdInline","KwdUsing","KwdNull","KwdTrue","KwdFalse","KwdAbstract","KwdMacro"] };
haxeparser.Keyword.KwdFunction = ["KwdFunction",0];
haxeparser.Keyword.KwdFunction.toString = $estr;
haxeparser.Keyword.KwdFunction.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdClass = ["KwdClass",1];
haxeparser.Keyword.KwdClass.toString = $estr;
haxeparser.Keyword.KwdClass.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdVar = ["KwdVar",2];
haxeparser.Keyword.KwdVar.toString = $estr;
haxeparser.Keyword.KwdVar.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdIf = ["KwdIf",3];
haxeparser.Keyword.KwdIf.toString = $estr;
haxeparser.Keyword.KwdIf.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdElse = ["KwdElse",4];
haxeparser.Keyword.KwdElse.toString = $estr;
haxeparser.Keyword.KwdElse.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdWhile = ["KwdWhile",5];
haxeparser.Keyword.KwdWhile.toString = $estr;
haxeparser.Keyword.KwdWhile.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDo = ["KwdDo",6];
haxeparser.Keyword.KwdDo.toString = $estr;
haxeparser.Keyword.KwdDo.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdFor = ["KwdFor",7];
haxeparser.Keyword.KwdFor.toString = $estr;
haxeparser.Keyword.KwdFor.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdBreak = ["KwdBreak",8];
haxeparser.Keyword.KwdBreak.toString = $estr;
haxeparser.Keyword.KwdBreak.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdContinue = ["KwdContinue",9];
haxeparser.Keyword.KwdContinue.toString = $estr;
haxeparser.Keyword.KwdContinue.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdReturn = ["KwdReturn",10];
haxeparser.Keyword.KwdReturn.toString = $estr;
haxeparser.Keyword.KwdReturn.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdExtends = ["KwdExtends",11];
haxeparser.Keyword.KwdExtends.toString = $estr;
haxeparser.Keyword.KwdExtends.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdImplements = ["KwdImplements",12];
haxeparser.Keyword.KwdImplements.toString = $estr;
haxeparser.Keyword.KwdImplements.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdImport = ["KwdImport",13];
haxeparser.Keyword.KwdImport.toString = $estr;
haxeparser.Keyword.KwdImport.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdSwitch = ["KwdSwitch",14];
haxeparser.Keyword.KwdSwitch.toString = $estr;
haxeparser.Keyword.KwdSwitch.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCase = ["KwdCase",15];
haxeparser.Keyword.KwdCase.toString = $estr;
haxeparser.Keyword.KwdCase.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDefault = ["KwdDefault",16];
haxeparser.Keyword.KwdDefault.toString = $estr;
haxeparser.Keyword.KwdDefault.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdStatic = ["KwdStatic",17];
haxeparser.Keyword.KwdStatic.toString = $estr;
haxeparser.Keyword.KwdStatic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPublic = ["KwdPublic",18];
haxeparser.Keyword.KwdPublic.toString = $estr;
haxeparser.Keyword.KwdPublic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPrivate = ["KwdPrivate",19];
haxeparser.Keyword.KwdPrivate.toString = $estr;
haxeparser.Keyword.KwdPrivate.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTry = ["KwdTry",20];
haxeparser.Keyword.KwdTry.toString = $estr;
haxeparser.Keyword.KwdTry.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCatch = ["KwdCatch",21];
haxeparser.Keyword.KwdCatch.toString = $estr;
haxeparser.Keyword.KwdCatch.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdNew = ["KwdNew",22];
haxeparser.Keyword.KwdNew.toString = $estr;
haxeparser.Keyword.KwdNew.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdThis = ["KwdThis",23];
haxeparser.Keyword.KwdThis.toString = $estr;
haxeparser.Keyword.KwdThis.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdThrow = ["KwdThrow",24];
haxeparser.Keyword.KwdThrow.toString = $estr;
haxeparser.Keyword.KwdThrow.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdExtern = ["KwdExtern",25];
haxeparser.Keyword.KwdExtern.toString = $estr;
haxeparser.Keyword.KwdExtern.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdEnum = ["KwdEnum",26];
haxeparser.Keyword.KwdEnum.toString = $estr;
haxeparser.Keyword.KwdEnum.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdIn = ["KwdIn",27];
haxeparser.Keyword.KwdIn.toString = $estr;
haxeparser.Keyword.KwdIn.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdInterface = ["KwdInterface",28];
haxeparser.Keyword.KwdInterface.toString = $estr;
haxeparser.Keyword.KwdInterface.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdUntyped = ["KwdUntyped",29];
haxeparser.Keyword.KwdUntyped.toString = $estr;
haxeparser.Keyword.KwdUntyped.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdCast = ["KwdCast",30];
haxeparser.Keyword.KwdCast.toString = $estr;
haxeparser.Keyword.KwdCast.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdOverride = ["KwdOverride",31];
haxeparser.Keyword.KwdOverride.toString = $estr;
haxeparser.Keyword.KwdOverride.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTypedef = ["KwdTypedef",32];
haxeparser.Keyword.KwdTypedef.toString = $estr;
haxeparser.Keyword.KwdTypedef.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdDynamic = ["KwdDynamic",33];
haxeparser.Keyword.KwdDynamic.toString = $estr;
haxeparser.Keyword.KwdDynamic.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdPackage = ["KwdPackage",34];
haxeparser.Keyword.KwdPackage.toString = $estr;
haxeparser.Keyword.KwdPackage.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdInline = ["KwdInline",35];
haxeparser.Keyword.KwdInline.toString = $estr;
haxeparser.Keyword.KwdInline.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdUsing = ["KwdUsing",36];
haxeparser.Keyword.KwdUsing.toString = $estr;
haxeparser.Keyword.KwdUsing.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdNull = ["KwdNull",37];
haxeparser.Keyword.KwdNull.toString = $estr;
haxeparser.Keyword.KwdNull.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdTrue = ["KwdTrue",38];
haxeparser.Keyword.KwdTrue.toString = $estr;
haxeparser.Keyword.KwdTrue.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdFalse = ["KwdFalse",39];
haxeparser.Keyword.KwdFalse.toString = $estr;
haxeparser.Keyword.KwdFalse.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdAbstract = ["KwdAbstract",40];
haxeparser.Keyword.KwdAbstract.toString = $estr;
haxeparser.Keyword.KwdAbstract.__enum__ = haxeparser.Keyword;
haxeparser.Keyword.KwdMacro = ["KwdMacro",41];
haxeparser.Keyword.KwdMacro.toString = $estr;
haxeparser.Keyword.KwdMacro.__enum__ = haxeparser.Keyword;
haxeparser.TokenDef = { __ename__ : true, __constructs__ : ["Kwd","Const","Sharp","Dollar","Unop","Binop","Comment","CommentLine","IntInterval","Semicolon","Dot","DblDot","Arrow","Comma","BkOpen","BkClose","BrOpen","BrClose","POpen","PClose","Question","At","Eof"] };
haxeparser.TokenDef.Kwd = function(k) { var $x = ["Kwd",0,k]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Const = function(c) { var $x = ["Const",1,c]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Sharp = function(s) { var $x = ["Sharp",2,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Dollar = function(s) { var $x = ["Dollar",3,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Unop = function(op) { var $x = ["Unop",4,op]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Binop = function(op) { var $x = ["Binop",5,op]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Comment = function(s) { var $x = ["Comment",6,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.CommentLine = function(s) { var $x = ["CommentLine",7,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.IntInterval = function(s) { var $x = ["IntInterval",8,s]; $x.__enum__ = haxeparser.TokenDef; $x.toString = $estr; return $x; };
haxeparser.TokenDef.Semicolon = ["Semicolon",9];
haxeparser.TokenDef.Semicolon.toString = $estr;
haxeparser.TokenDef.Semicolon.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Dot = ["Dot",10];
haxeparser.TokenDef.Dot.toString = $estr;
haxeparser.TokenDef.Dot.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.DblDot = ["DblDot",11];
haxeparser.TokenDef.DblDot.toString = $estr;
haxeparser.TokenDef.DblDot.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Arrow = ["Arrow",12];
haxeparser.TokenDef.Arrow.toString = $estr;
haxeparser.TokenDef.Arrow.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Comma = ["Comma",13];
haxeparser.TokenDef.Comma.toString = $estr;
haxeparser.TokenDef.Comma.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BkOpen = ["BkOpen",14];
haxeparser.TokenDef.BkOpen.toString = $estr;
haxeparser.TokenDef.BkOpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BkClose = ["BkClose",15];
haxeparser.TokenDef.BkClose.toString = $estr;
haxeparser.TokenDef.BkClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BrOpen = ["BrOpen",16];
haxeparser.TokenDef.BrOpen.toString = $estr;
haxeparser.TokenDef.BrOpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.BrClose = ["BrClose",17];
haxeparser.TokenDef.BrClose.toString = $estr;
haxeparser.TokenDef.BrClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.POpen = ["POpen",18];
haxeparser.TokenDef.POpen.toString = $estr;
haxeparser.TokenDef.POpen.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.PClose = ["PClose",19];
haxeparser.TokenDef.PClose.toString = $estr;
haxeparser.TokenDef.PClose.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Question = ["Question",20];
haxeparser.TokenDef.Question.toString = $estr;
haxeparser.TokenDef.Question.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.At = ["At",21];
haxeparser.TokenDef.At.toString = $estr;
haxeparser.TokenDef.At.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDef.Eof = ["Eof",22];
haxeparser.TokenDef.Eof.toString = $estr;
haxeparser.TokenDef.Eof.__enum__ = haxeparser.TokenDef;
haxeparser.TokenDefPrinter = function() { };
haxeparser.TokenDefPrinter.__name__ = true;
haxeparser.TokenDefPrinter.print = function(def) {
	switch(def[1]) {
	case 0:
		var k = def[2];
		return HxOverrides.substr(k[0],3,null).toLowerCase();
	case 1:
		switch(def[2][1]) {
		case 0:
			var s = def[2][2];
			return s;
		case 1:
			var s = def[2][2];
			return s;
		case 2:
			var s = def[2][2];
			return s;
		case 3:
			var s = def[2][2];
			return s;
		case 4:
			var opt = def[2][3];
			var r = def[2][2];
			return "~/" + r + "/" + opt;
		}
		break;
	case 2:
		var s1 = def[2];
		return "#" + s1;
	case 3:
		var s2 = def[2];
		return "$" + s2;
	case 4:
		var op = def[2];
		return new haxe.macro.Printer("").printUnop(op);
	case 5:
		var op1 = def[2];
		return new haxe.macro.Printer("").printBinop(op1);
	case 6:
		var s3 = def[2];
		return "/*" + s3 + "/*";
	case 7:
		var s4 = def[2];
		return "//" + s4;
	case 8:
		var s5 = def[2];
		return "" + s5 + "...";
	case 9:
		return ";";
	case 10:
		return ".";
	case 11:
		return ":";
	case 12:
		return "->";
	case 13:
		return ",";
	case 14:
		return "[";
	case 15:
		return "]";
	case 16:
		return "{";
	case 17:
		return "}";
	case 18:
		return "(";
	case 19:
		return ")";
	case 20:
		return "?";
	case 21:
		return "@";
	case 22:
		return "<eof>";
	}
};
haxeparser.Token = function(tok,pos) {
	this.tok = tok;
	this.pos = pos;
};
haxeparser.Token.__name__ = true;
haxeparser.Token.prototype = {
	toString: function() {
		return haxeparser.TokenDefPrinter.print(this.tok);
	}
	,__class__: haxeparser.Token
};
haxeparser.TypeDef = { __ename__ : true, __constructs__ : ["EClass","EEnum","EAbstract","EImport","ETypedef","EUsing"] };
haxeparser.TypeDef.EClass = function(d) { var $x = ["EClass",0,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EEnum = function(d) { var $x = ["EEnum",1,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EAbstract = function(a) { var $x = ["EAbstract",2,a]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EImport = function(sl,mode) { var $x = ["EImport",3,sl,mode]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.ETypedef = function(d) { var $x = ["ETypedef",4,d]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.TypeDef.EUsing = function(path) { var $x = ["EUsing",5,path]; $x.__enum__ = haxeparser.TypeDef; $x.toString = $estr; return $x; };
haxeparser.ClassFlag = { __ename__ : true, __constructs__ : ["HInterface","HExtern","HPrivate","HExtends","HImplements"] };
haxeparser.ClassFlag.HInterface = ["HInterface",0];
haxeparser.ClassFlag.HInterface.toString = $estr;
haxeparser.ClassFlag.HInterface.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HExtern = ["HExtern",1];
haxeparser.ClassFlag.HExtern.toString = $estr;
haxeparser.ClassFlag.HExtern.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HPrivate = ["HPrivate",2];
haxeparser.ClassFlag.HPrivate.toString = $estr;
haxeparser.ClassFlag.HPrivate.__enum__ = haxeparser.ClassFlag;
haxeparser.ClassFlag.HExtends = function(t) { var $x = ["HExtends",3,t]; $x.__enum__ = haxeparser.ClassFlag; $x.toString = $estr; return $x; };
haxeparser.ClassFlag.HImplements = function(t) { var $x = ["HImplements",4,t]; $x.__enum__ = haxeparser.ClassFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag = { __ename__ : true, __constructs__ : ["APrivAbstract","AFromType","AToType","AIsType"] };
haxeparser.AbstractFlag.APrivAbstract = ["APrivAbstract",0];
haxeparser.AbstractFlag.APrivAbstract.toString = $estr;
haxeparser.AbstractFlag.APrivAbstract.__enum__ = haxeparser.AbstractFlag;
haxeparser.AbstractFlag.AFromType = function(ct) { var $x = ["AFromType",1,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag.AToType = function(ct) { var $x = ["AToType",2,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.AbstractFlag.AIsType = function(ct) { var $x = ["AIsType",3,ct]; $x.__enum__ = haxeparser.AbstractFlag; $x.toString = $estr; return $x; };
haxeparser.EnumFlag = { __ename__ : true, __constructs__ : ["EPrivate","EExtern"] };
haxeparser.EnumFlag.EPrivate = ["EPrivate",0];
haxeparser.EnumFlag.EPrivate.toString = $estr;
haxeparser.EnumFlag.EPrivate.__enum__ = haxeparser.EnumFlag;
haxeparser.EnumFlag.EExtern = ["EExtern",1];
haxeparser.EnumFlag.EExtern.toString = $estr;
haxeparser.EnumFlag.EExtern.__enum__ = haxeparser.EnumFlag;
haxeparser.ImportMode = { __ename__ : true, __constructs__ : ["INormal","IAsName","IAll"] };
haxeparser.ImportMode.INormal = ["INormal",0];
haxeparser.ImportMode.INormal.toString = $estr;
haxeparser.ImportMode.INormal.__enum__ = haxeparser.ImportMode;
haxeparser.ImportMode.IAsName = function(s) { var $x = ["IAsName",1,s]; $x.__enum__ = haxeparser.ImportMode; $x.toString = $estr; return $x; };
haxeparser.ImportMode.IAll = ["IAll",2];
haxeparser.ImportMode.IAll.toString = $estr;
haxeparser.ImportMode.IAll.__enum__ = haxeparser.ImportMode;
haxeparser.LexerErrorMsg = { __ename__ : true, __constructs__ : ["UnterminatedString","UnterminatedRegExp","UnclosedComment"] };
haxeparser.LexerErrorMsg.UnterminatedString = ["UnterminatedString",0];
haxeparser.LexerErrorMsg.UnterminatedString.toString = $estr;
haxeparser.LexerErrorMsg.UnterminatedString.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerErrorMsg.UnterminatedRegExp = ["UnterminatedRegExp",1];
haxeparser.LexerErrorMsg.UnterminatedRegExp.toString = $estr;
haxeparser.LexerErrorMsg.UnterminatedRegExp.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerErrorMsg.UnclosedComment = ["UnclosedComment",2];
haxeparser.LexerErrorMsg.UnclosedComment.toString = $estr;
haxeparser.LexerErrorMsg.UnclosedComment.__enum__ = haxeparser.LexerErrorMsg;
haxeparser.LexerError = function(msg,pos) {
	this.msg = msg;
	this.pos = pos;
};
haxeparser.LexerError.__name__ = true;
haxeparser.LexerError.prototype = {
	__class__: haxeparser.LexerError
};
var hxparse = {};
hxparse.Lexer = function(input,sourceName) {
	if(sourceName == null) sourceName = "<null>";
	this.current = "";
	this.input = input;
	this.source = sourceName;
	this.pos = 0;
	this.eof = false;
};
hxparse.Lexer.__name__ = true;
hxparse.Lexer.buildRuleset = function(rules) {
	var cases = [];
	var functions = [];
	var eofFunction = null;
	var _g = 0;
	while(_g < rules.length) {
		var rule = rules[_g];
		++_g;
		if(rule.rule == "") eofFunction = rule.func; else {
			cases.push(hxparse.LexEngine.parse(rule.rule));
			functions.push(rule.func);
		}
	}
	return new hxparse.Ruleset(new hxparse.LexEngine(cases).firstState(),functions,eofFunction);
};
hxparse.Lexer.prototype = {
	curPos: function() {
		return new hxparse.Position(this.source,this.pos - this.current.length,this.pos);
	}
	,token: function(ruleset) {
		if(this.eof) {
			if(ruleset.eofFunction != null) return ruleset.eofFunction(this); else throw new haxe.io.Eof();
		}
		var state = ruleset.state;
		var lastMatch = null;
		var lastMatchPos = this.pos;
		var start = this.pos;
		while(true) {
			if(state.final > -1) {
				lastMatch = state;
				lastMatchPos = this.pos;
			}
			if(this.pos == byte.js._ByteData.ByteData_Impl_.get_length(this.input)) {
				this.eof = true;
				break;
			}
			var i = this.input[this.pos];
			this.pos++;
			state = state.trans[i];
			if(state == null) break;
		}
		this.pos = lastMatchPos;
		this.current = byte.js._ByteData.ByteData_Impl_.readString(this.input,start,this.pos - start);
		if(lastMatch == null || lastMatch.final == -1) throw new hxparse.UnexpectedChar(String.fromCharCode(this.input[this.pos]),new hxparse.Position(this.source,this.pos - this.current.length,this.pos));
		return ruleset.functions[lastMatch.final](this);
	}
	,__class__: hxparse.Lexer
};
hxparse.RuleBuilder = function() { };
hxparse.RuleBuilder.__name__ = true;
hxparse.LexEngine = function(patterns) {
	this.nodes = [];
	this.finals = [];
	this.states = [];
	this.hstates = new haxe.ds.StringMap();
	this.uid = 0;
	var pid = 0;
	var _g = 0;
	while(_g < patterns.length) {
		var p = patterns[_g];
		++_g;
		var id = pid++;
		var f = new hxparse._LexEngine.Node(this.uid++,id);
		var n = this.initNode(p,f,id);
		this.nodes.push(n);
		this.finals.push(f);
	}
	this.makeState(this.addNodes([],this.nodes));
};
hxparse.LexEngine.__name__ = true;
hxparse.LexEngine.single = function(c) {
	return [{ min : c, max : c}];
};
hxparse.LexEngine.parse = function(pattern) {
	var p = hxparse.LexEngine.parseInner(pattern);
	if(p == null) throw "Invalid pattern '" + pattern + "'";
	return p.pattern;
};
hxparse.LexEngine.next = function(a,b) {
	if(a == hxparse._LexEngine.Pattern.Empty) return b; else return hxparse._LexEngine.Pattern.Next(a,b);
};
hxparse.LexEngine.plus = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.plus(r2));
	default:
		return hxparse._LexEngine.Pattern.Plus(r);
	}
};
hxparse.LexEngine.star = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.star(r2));
	default:
		return hxparse._LexEngine.Pattern.Star(r);
	}
};
hxparse.LexEngine.opt = function(r) {
	switch(r[1]) {
	case 4:
		var r2 = r[3];
		var r1 = r[2];
		return hxparse._LexEngine.Pattern.Next(r1,hxparse.LexEngine.opt(r2));
	default:
		return hxparse._LexEngine.Pattern.Choice(r,hxparse._LexEngine.Pattern.Empty);
	}
};
hxparse.LexEngine.cinter = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),hxparse.LexEngine.ccomplement(c2)));
};
hxparse.LexEngine.cdiff = function(c1,c2) {
	return hxparse.LexEngine.ccomplement(hxparse.LexEngine.cunion(hxparse.LexEngine.ccomplement(c1),c2));
};
hxparse.LexEngine.ccomplement = function(c) {
	var first = c[0];
	var start;
	if(first != null && first.min == -1) start = c.shift().max + 1; else start = -1;
	var out = [];
	var _g = 0;
	while(_g < c.length) {
		var k = c[_g];
		++_g;
		out.push({ min : start, max : k.min - 1});
		start = k.max + 1;
	}
	if(start <= 255) out.push({ min : start, max : 255});
	return out;
};
hxparse.LexEngine.cunion = function(ca,cb) {
	var i = 0;
	var j = 0;
	var out = [];
	var a = ca[i++];
	var b = cb[j++];
	while(true) {
		if(a == null) {
			out.push(b);
			while(j < cb.length) out.push(cb[j++]);
			break;
		}
		if(b == null) {
			out.push(a);
			while(i < ca.length) out.push(ca[i++]);
			break;
		}
		if(a.min <= b.min) {
			if(a.max + 1 < b.min) {
				out.push(a);
				a = ca[i++];
			} else if(a.max < b.max) {
				b = { min : a.min, max : b.max};
				a = ca[i++];
			} else b = cb[j++];
		} else {
			var tmp = ca;
			ca = cb;
			cb = tmp;
			var tmp1 = j;
			j = i;
			i = tmp1;
			var tmp2 = a;
			a = b;
			b = tmp2;
		}
	}
	return out;
};
hxparse.LexEngine.parseInner = function(pattern,i,pDepth) {
	if(pDepth == null) pDepth = 0;
	if(i == null) i = 0;
	var r = hxparse._LexEngine.Pattern.Empty;
	var l = pattern.length;
	while(i < l) {
		var c;
		var index = i++;
		c = pattern.charCodeAt(index);
		switch(c) {
		case 43:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.plus(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 42:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.star(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 63:
			if(r != hxparse._LexEngine.Pattern.Empty) r = hxparse.LexEngine.opt(r); else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 124:
			if(r != hxparse._LexEngine.Pattern.Empty) {
				var r2 = hxparse.LexEngine.parseInner(pattern,i);
				return { pattern : hxparse._LexEngine.Pattern.Choice(r,r2.pattern), pos : r2.pos};
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 40:
			var r21 = hxparse.LexEngine.parseInner(pattern,i,pDepth + 1);
			i = r21.pos;
			r = hxparse.LexEngine.next(r,r21.pattern);
			break;
		case 41:
			return { pattern : hxparse._LexEngine.Pattern.Group(r), pos : i};
		case 91:
			if(pattern.length > 1) {
				var range = 0;
				var acc = [];
				var not = pattern.charCodeAt(i) == 94;
				if(not) i++;
				while(true) {
					var c1;
					var index1 = i++;
					c1 = pattern.charCodeAt(index1);
					if(c1 == 93) {
						if(range != 0) return null;
						break;
					} else if(c1 == 45) {
						if(range != 0) return null;
						var last = acc.pop();
						if(last == null) acc.push({ min : c1, max : c1}); else {
							if(last.min != last.max) return null;
							range = last.min;
						}
					} else {
						if(c1 == 92) {
							var index2 = i++;
							c1 = pattern.charCodeAt(index2);
						}
						if(range == 0) acc.push({ min : c1, max : c1}); else {
							acc.push({ min : range, max : c1});
							range = 0;
						}
					}
				}
				var g = [];
				var _g = 0;
				while(_g < acc.length) {
					var k = acc[_g];
					++_g;
					g = hxparse.LexEngine.cunion(g,[k]);
				}
				if(not) g = hxparse.LexEngine.cdiff(hxparse.LexEngine.ALL_CHARS,g);
				r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match(g));
			} else r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		case 92:
			var index3 = i++;
			c = pattern.charCodeAt(index3);
			if(c != c) c = 92; else if(c >= 48 && c <= 57) {
				var v = c - 48;
				while(true) {
					var cNext = pattern.charCodeAt(i);
					if(cNext >= 48 && cNext <= 57) {
						v = v * 10 + (cNext - 48);
						++i;
					} else break;
				}
				c = v;
			}
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
			break;
		default:
			r = hxparse.LexEngine.next(r,hxparse._LexEngine.Pattern.Match([{ min : c, max : c}]));
		}
	}
	if(pDepth != 0) throw "Found unclosed parenthesis while parsing \"" + pattern + "\"";
	return { pattern : r, pos : i};
};
hxparse.LexEngine.prototype = {
	firstState: function() {
		return this.states[0];
	}
	,makeState: function(nodes) {
		var _g = this;
		var buf = new StringBuf();
		var _g1 = 0;
		while(_g1 < nodes.length) {
			var n = nodes[_g1];
			++_g1;
			buf.b += "" + n.id;
			buf.b += "-";
		}
		var key = buf.b;
		var s = this.hstates.get(key);
		if(s != null) return s;
		s = new hxparse.State();
		this.states.push(s);
		this.hstates.set(key,s);
		var trans = this.getTransitions(nodes);
		var _g2 = 0;
		while(_g2 < trans.length) {
			var t = trans[_g2];
			++_g2;
			var target = this.makeState(t.n);
			var _g11 = 0;
			var _g21 = t.chars;
			while(_g11 < _g21.length) {
				var chr = _g21[_g11];
				++_g11;
				var _g4 = chr.min;
				var _g3 = chr.max + 1;
				while(_g4 < _g3) {
					var i = _g4++;
					s.trans[i] = target;
				}
			}
		}
		var setFinal = function() {
			var _g12 = 0;
			var _g22 = _g.finals;
			while(_g12 < _g22.length) {
				var f = _g22[_g12];
				++_g12;
				var _g31 = 0;
				while(_g31 < nodes.length) {
					var n1 = nodes[_g31];
					++_g31;
					if(n1 == f) {
						s.final = n1.pid;
						return;
					}
				}
			}
		};
		if(s.final == -1) setFinal();
		return s;
	}
	,getTransitions: function(nodes) {
		var tl = [];
		var _g = 0;
		while(_g < nodes.length) {
			var n = nodes[_g];
			++_g;
			var _g1 = 0;
			var _g2 = n.trans;
			while(_g1 < _g2.length) {
				var t = _g2[_g1];
				++_g1;
				tl.push(t);
			}
		}
		tl.sort(function(t1,t2) {
			return t1.n.id - t2.n.id;
		});
		var t0 = tl[0];
		var _g11 = 1;
		var _g3 = tl.length;
		while(_g11 < _g3) {
			var i = _g11++;
			var t11 = tl[i];
			if(t0.n == t11.n) {
				tl[i - 1] = null;
				t11 = { chars : hxparse.LexEngine.cunion(t0.chars,t11.chars), n : t11.n};
				tl[i] = t11;
			}
			t0 = t11;
		}
		while(HxOverrides.remove(tl,null)) {
		}
		var allChars = hxparse.LexEngine.EMPTY;
		var allStates = new List();
		var _g4 = 0;
		while(_g4 < tl.length) {
			var t3 = tl[_g4];
			++_g4;
			var states = new List();
			states.push({ chars : hxparse.LexEngine.cdiff(t3.chars,allChars), n : [t3.n]});
			var $it0 = allStates.iterator();
			while( $it0.hasNext() ) {
				var s = $it0.next();
				var nodes1 = s.n.slice();
				nodes1.push(t3.n);
				states.push({ chars : hxparse.LexEngine.cinter(s.chars,t3.chars), n : nodes1});
				states.push({ chars : hxparse.LexEngine.cdiff(s.chars,t3.chars), n : s.n});
			}
			var $it1 = states.iterator();
			while( $it1.hasNext() ) {
				var s1 = $it1.next();
				if(s1.chars.length == 0) states.remove(s1);
			}
			allChars = hxparse.LexEngine.cunion(allChars,t3.chars);
			allStates = states;
		}
		var states1 = [];
		var $it2 = allStates.iterator();
		while( $it2.hasNext() ) {
			var s2 = $it2.next();
			states1.push({ chars : s2.chars, n : this.addNodes([],s2.n)});
		}
		states1.sort(function(s11,s21) {
			var a = s11.chars.length;
			var b = s21.chars.length;
			var _g12 = 0;
			var _g5;
			if(a < b) _g5 = a; else _g5 = b;
			while(_g12 < _g5) {
				var i1 = _g12++;
				var a1 = s11.chars[i1];
				var b1 = s21.chars[i1];
				if(a1.min != b1.min) return b1.min - a1.min;
				if(a1.max != b1.max) return b1.max - a1.max;
			}
			if(a < b) return b - a;
			return 0;
		});
		return states1;
	}
	,addNode: function(nodes,n) {
		var _g = 0;
		while(_g < nodes.length) {
			var n2 = nodes[_g];
			++_g;
			if(n == n2) return;
		}
		nodes.push(n);
		this.addNodes(nodes,n.epsilon);
	}
	,addNodes: function(nodes,add) {
		var _g = 0;
		while(_g < add.length) {
			var n = add[_g];
			++_g;
			this.addNode(nodes,n);
		}
		return nodes;
	}
	,node: function(pid) {
		return new hxparse._LexEngine.Node(this.uid++,pid);
	}
	,initNode: function(p,final,pid) {
		switch(p[1]) {
		case 0:
			return final;
		case 1:
			var c = p[2];
			var n = new hxparse._LexEngine.Node(this.uid++,pid);
			n.trans.push({ chars : c, n : final});
			return n;
		case 2:
			var p1 = p[2];
			var n1 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an = this.initNode(p1,n1,pid);
			n1.epsilon.push(an);
			n1.epsilon.push(final);
			return n1;
		case 3:
			var p2 = p[2];
			var n2 = new hxparse._LexEngine.Node(this.uid++,pid);
			var an1 = this.initNode(p2,n2,pid);
			n2.epsilon.push(an1);
			n2.epsilon.push(final);
			return an1;
		case 4:
			var b = p[3];
			var a = p[2];
			return this.initNode(a,this.initNode(b,final,pid),pid);
		case 5:
			var b1 = p[3];
			var a1 = p[2];
			var n3 = new hxparse._LexEngine.Node(this.uid++,pid);
			n3.epsilon.push(this.initNode(a1,final,pid));
			n3.epsilon.push(this.initNode(b1,final,pid));
			return n3;
		case 6:
			var p3 = p[2];
			return this.initNode(p3,final,pid);
		}
	}
	,__class__: hxparse.LexEngine
};
hxparse._LexEngine = {};
hxparse._LexEngine.Pattern = { __ename__ : true, __constructs__ : ["Empty","Match","Star","Plus","Next","Choice","Group"] };
hxparse._LexEngine.Pattern.Empty = ["Empty",0];
hxparse._LexEngine.Pattern.Empty.toString = $estr;
hxparse._LexEngine.Pattern.Empty.__enum__ = hxparse._LexEngine.Pattern;
hxparse._LexEngine.Pattern.Match = function(c) { var $x = ["Match",1,c]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Star = function(p) { var $x = ["Star",2,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Plus = function(p) { var $x = ["Plus",3,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Next = function(p1,p2) { var $x = ["Next",4,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Choice = function(p1,p2) { var $x = ["Choice",5,p1,p2]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Pattern.Group = function(p) { var $x = ["Group",6,p]; $x.__enum__ = hxparse._LexEngine.Pattern; $x.toString = $estr; return $x; };
hxparse._LexEngine.Node = function(id,pid) {
	this.id = id;
	this.pid = pid;
	this.trans = [];
	this.epsilon = [];
};
hxparse._LexEngine.Node.__name__ = true;
hxparse._LexEngine.Node.prototype = {
	__class__: hxparse._LexEngine.Node
};
hxparse.Ruleset = function(state,functions,eofFunction) {
	this.state = state;
	this.functions = functions;
	this.eofFunction = eofFunction;
};
hxparse.Ruleset.__name__ = true;
hxparse.Ruleset.prototype = {
	__class__: hxparse.Ruleset
};
hxparse.Position = function(source,min,max) {
	this.psource = source;
	this.pmin = min;
	this.pmax = max;
};
hxparse.Position.__name__ = true;
hxparse.Position.union = function(p1,p2) {
	return new hxparse.Position(p1.psource,p1.pmin < p2.pmin?p1.pmin:p2.pmin,p1.pmax > p2.pmax?p1.pmax:p2.pmax);
};
hxparse.Position.prototype = {
	toString: function() {
		return "" + this.psource + ":characters " + this.pmin + "-" + this.pmax;
	}
	,format: function(input) {
		var lineMin = 1;
		var lineMax = 1;
		var posMin = 0;
		var posMax = 0;
		var cur = 0;
		while(cur < this.pmin) {
			if(input[cur] == 10) {
				lineMin++;
				posMin = cur;
			}
			cur++;
		}
		lineMax = lineMin;
		posMax = posMin;
		posMin = cur - posMin;
		while(cur < this.pmax) {
			if(input[cur] == 10) {
				lineMax++;
				posMax = cur;
			}
			cur++;
		}
		posMax = cur - posMax;
		if(lineMin != lineMax) return "" + this.psource + ":lines " + lineMin + "-" + lineMax; else return "" + this.psource + ":line " + lineMin + ":characters " + posMin + "-" + posMax;
	}
	,__class__: hxparse.Position
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
haxeparser.HaxeLexer = function(input,sourceName) {
	hxparse.Lexer.call(this,input,sourceName);
};
haxeparser.HaxeLexer.__name__ = true;
haxeparser.HaxeLexer.__interfaces__ = [hxparse.RuleBuilder];
haxeparser.HaxeLexer.mkPos = function(p) {
	return { file : p.psource, min : p.pmin, max : p.pmax};
};
haxeparser.HaxeLexer.mk = function(lexer,td) {
	return new haxeparser.Token(td,haxeparser.HaxeLexer.mkPos(new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos)));
};
haxeparser.HaxeLexer.__super__ = hxparse.Lexer;
haxeparser.HaxeLexer.prototype = $extend(hxparse.Lexer.prototype,{
	__class__: haxeparser.HaxeLexer
});
haxeparser.ParserErrorMsg = { __ename__ : true, __constructs__ : ["MissingSemicolon","MissingType","DuplicateDefault","Custom"] };
haxeparser.ParserErrorMsg.MissingSemicolon = ["MissingSemicolon",0];
haxeparser.ParserErrorMsg.MissingSemicolon.toString = $estr;
haxeparser.ParserErrorMsg.MissingSemicolon.__enum__ = haxeparser.ParserErrorMsg;
haxeparser.ParserErrorMsg.MissingType = ["MissingType",1];
haxeparser.ParserErrorMsg.MissingType.toString = $estr;
haxeparser.ParserErrorMsg.MissingType.__enum__ = haxeparser.ParserErrorMsg;
haxeparser.ParserErrorMsg.DuplicateDefault = ["DuplicateDefault",2];
haxeparser.ParserErrorMsg.DuplicateDefault.toString = $estr;
haxeparser.ParserErrorMsg.DuplicateDefault.__enum__ = haxeparser.ParserErrorMsg;
haxeparser.ParserErrorMsg.Custom = function(s) { var $x = ["Custom",3,s]; $x.__enum__ = haxeparser.ParserErrorMsg; $x.toString = $estr; return $x; };
haxeparser.SmallType = { __ename__ : true, __constructs__ : ["SNull","SBool","SFloat","SString"] };
haxeparser.SmallType.SNull = ["SNull",0];
haxeparser.SmallType.SNull.toString = $estr;
haxeparser.SmallType.SNull.__enum__ = haxeparser.SmallType;
haxeparser.SmallType.SBool = function(b) { var $x = ["SBool",1,b]; $x.__enum__ = haxeparser.SmallType; $x.toString = $estr; return $x; };
haxeparser.SmallType.SFloat = function(f) { var $x = ["SFloat",2,f]; $x.__enum__ = haxeparser.SmallType; $x.toString = $estr; return $x; };
haxeparser.SmallType.SString = function(s) { var $x = ["SString",3,s]; $x.__enum__ = haxeparser.SmallType; $x.toString = $estr; return $x; };
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.__name__ = true;
hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype = {
	peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token
};
hxparse.ParserBuilder = function() { };
hxparse.ParserBuilder.__name__ = true;
haxeparser.HaxeParser = function(input,sourceName) {
	this.doResume = false;
	hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.call(this,new haxeparser.HaxeLexer(input,sourceName),haxeparser.HaxeLexer.tok);
	this.mstack = [];
	this.defines = new haxe.ds.StringMap();
	this.defines.set("true",true);
	this.inMacro = false;
	this.doc = "";
};
haxeparser.HaxeParser.__name__ = true;
haxeparser.HaxeParser.__interfaces__ = [hxparse.ParserBuilder];
haxeparser.HaxeParser.punion = function(p1,p2) {
	return { file : p1.file, min : p1.min < p2.min?p1.min:p2.min, max : p1.max > p2.max?p1.max:p2.max};
};
haxeparser.HaxeParser.quoteIdent = function(s) {
	return s;
};
haxeparser.HaxeParser.isLowerIdent = function(s) {
	var loop;
	var loop1 = null;
	loop1 = function(p) {
		var c = HxOverrides.cca(s,p);
		if(c >= 97 && c <= 122) return true; else if(c == 95) {
			if(p + 1 < s.length) return loop1(p + 1); else return true;
		} else return false;
	};
	loop = loop1;
	return loop(0);
};
haxeparser.HaxeParser.isPostfix = function(e,u) {
	switch(u[1]) {
	case 0:case 1:
		{
			var _g = e.expr;
			switch(_g[1]) {
			case 0:case 3:case 1:
				return true;
			default:
				return false;
			}
		}
		break;
	case 2:case 3:case 4:
		return false;
	}
};
haxeparser.HaxeParser.isPrefix = function(u) {
	switch(u[1]) {
	case 0:case 1:
		return true;
	case 2:case 3:case 4:
		return true;
	}
};
haxeparser.HaxeParser.precedence = function(op) {
	var left = true;
	var right = false;
	switch(op[1]) {
	case 19:
		return { p : 0, left : left};
	case 1:case 2:
		return { p : 0, left : left};
	case 0:case 3:
		return { p : 0, left : left};
	case 16:case 17:case 18:
		return { p : 0, left : left};
	case 12:case 11:case 13:
		return { p : 0, left : left};
	case 5:case 6:case 7:case 9:case 8:case 10:
		return { p : 0, left : left};
	case 21:
		return { p : 0, left : left};
	case 14:
		return { p : 0, left : left};
	case 15:
		return { p : 0, left : left};
	case 22:
		return { p : 0, left : left};
	case 4:case 20:
		return { p : 10, left : right};
	}
};
haxeparser.HaxeParser.isNotAssign = function(op) {
	switch(op[1]) {
	case 4:case 20:
		return false;
	default:
		return true;
	}
};
haxeparser.HaxeParser.isDollarIdent = function(e) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 0:
			switch(_g[2][1]) {
			case 3:
				var n = _g[2][2];
				if(HxOverrides.cca(n,0) == 36) return true; else return false;
				break;
			default:
				return false;
			}
			break;
		default:
			return false;
		}
	}
};
haxeparser.HaxeParser.swap = function(op1,op2) {
	var i1 = haxeparser.HaxeParser.precedence(op1);
	var i2 = haxeparser.HaxeParser.precedence(op2);
	return i1.left && i1.p < i2.p;
};
haxeparser.HaxeParser.makeBinop = function(op,e,e2) {
	{
		var _g = e2.expr;
		switch(_g[1]) {
		case 2:
			var _e2 = _g[4];
			var _e = _g[3];
			var _op = _g[2];
			if(haxeparser.HaxeParser.swap(op,_op)) {
				var _e1 = haxeparser.HaxeParser.makeBinop(op,e,_e);
				return { expr : haxe.macro.ExprDef.EBinop(_op,_e1,_e2), pos : haxeparser.HaxeParser.punion(_e1.pos,_e2.pos)};
			} else return { expr : haxe.macro.ExprDef.EBinop(op,e,e2), pos : haxeparser.HaxeParser.punion(e.pos,e2.pos)};
			break;
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e1 = _g[2];
			if(haxeparser.HaxeParser.isNotAssign(op)) {
				var e4 = haxeparser.HaxeParser.makeBinop(op,e,e1);
				return { expr : haxe.macro.ExprDef.ETernary(e4,e21,e3), pos : haxeparser.HaxeParser.punion(e4.pos,e3.pos)};
			} else return { expr : haxe.macro.ExprDef.EBinop(op,e,e2), pos : haxeparser.HaxeParser.punion(e.pos,e2.pos)};
			break;
		default:
			return { expr : haxe.macro.ExprDef.EBinop(op,e,e2), pos : haxeparser.HaxeParser.punion(e.pos,e2.pos)};
		}
	}
};
haxeparser.HaxeParser.makeUnop = function(op,e,p1) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 2:
			var e2 = _g[4];
			var e1 = _g[3];
			var bop = _g[2];
			return { expr : haxe.macro.ExprDef.EBinop(bop,haxeparser.HaxeParser.makeUnop(op,e1,p1),e2), pos : haxeparser.HaxeParser.punion(p1,e1.pos)};
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e11 = _g[2];
			return { expr : haxe.macro.ExprDef.ETernary(haxeparser.HaxeParser.makeUnop(op,e11,p1),e21,e3), pos : haxeparser.HaxeParser.punion(p1,e.pos)};
		default:
			return { expr : haxe.macro.ExprDef.EUnop(op,false,e), pos : haxeparser.HaxeParser.punion(p1,e.pos)};
		}
	}
};
haxeparser.HaxeParser.makeMeta = function(name,params,e,p1) {
	{
		var _g = e.expr;
		switch(_g[1]) {
		case 2:
			var e2 = _g[4];
			var e1 = _g[3];
			var bop = _g[2];
			return { expr : haxe.macro.ExprDef.EBinop(bop,haxeparser.HaxeParser.makeMeta(name,params,e1,p1),e2), pos : haxeparser.HaxeParser.punion(p1,e1.pos)};
		case 27:
			var e3 = _g[4];
			var e21 = _g[3];
			var e11 = _g[2];
			return { expr : haxe.macro.ExprDef.ETernary(haxeparser.HaxeParser.makeMeta(name,params,e11,p1),e21,e3), pos : haxeparser.HaxeParser.punion(p1,e.pos)};
		default:
			return { expr : haxe.macro.ExprDef.EMeta({ name : name, params : params, pos : p1},e), pos : haxeparser.HaxeParser.punion(p1,e.pos)};
		}
	}
};
haxeparser.HaxeParser.aadd = function(a,t) {
	a.push(t);
	return a;
};
haxeparser.HaxeParser.__super__ = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token;
haxeparser.HaxeParser.prototype = $extend(hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype,{
	define: function(flag,value) {
		var value1 = value;
		this.defines.set(flag,value1);
	}
	,parse: function() {
		return this.parseFile();
	}
	,peek: function(n) {
		if(n == 0) {
			var tk = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,0);
			{
				var t = tk;
				switch(tk.tok[1]) {
				case 7:case 6:
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.peek(0);
				case 2:
					switch(tk.tok[2]) {
					case "error":case "line":
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.peek(0);
					case "end":
						this.last = this.token.elt;
						this.token = this.token.next;
						if(this.mstack.length == 0) return tk; else {
							this.mstack.shift();
							return this.peek(0);
						}
						break;
					case "else":case "elseif":
						this.last = this.token.elt;
						this.token = this.token.next;
						if(this.mstack.length == 0) return tk; else {
							this.mstack.shift();
							return this.skipTokens(tk.pos,false);
						}
						break;
					case "if":
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.enterMacro(tk.pos);
					default:
						return t;
					}
					break;
				default:
					return t;
				}
			}
		} else return hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,n);
	}
	,keywordString: function(k) {
		return ((function($this) {
			var $r;
			var _this = Std.string(k);
			$r = HxOverrides.substr(_this,3,null);
			return $r;
		}(this))).toLowerCase();
	}
	,parseMacroCond: function(allowOp) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var t = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.parseMacroIdent(allowOp,t,p);
				case 2:
					var p1 = _g.pos;
					var s = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe.ds.Option.None, expr : { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CString(s)), pos : p1}};
				case 0:
					var p2 = _g.pos;
					var s1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe.ds.Option.None, expr : { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(s1)), pos : p2}};
				case 1:
					var p3 = _g.pos;
					var s2 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { tk : haxe.ds.Option.None, expr : { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(s2)), pos : p3}};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 0:
				var p4 = _g.pos;
				var k = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.parseMacroIdent(allowOp,this.keywordString(k),p4);
			case 18:
				var p11 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				var o = this.parseMacroCond(true);
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						var p21 = _g1.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var e = { expr : haxe.macro.ExprDef.EParenthesis(o.expr), pos : haxeparser.HaxeParser.punion(p11,p21)};
						if(allowOp) return this.parseMacroOp(e); else return { tk : haxe.ds.Option.None, expr : e};
						break;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 4:
				var p5 = _g.pos;
				var op = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				var o1 = this.parseMacroCond(allowOp);
				return { tk : o1.tk, expr : haxeparser.HaxeParser.makeUnop(op,o1.expr,p5)};
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseMacroIdent: function(allowOp,t,p) {
		var e = { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent(t)), pos : p};
		if(!allowOp) return { tk : haxe.ds.Option.None, expr : e}; else return this.parseMacroOp(e);
	}
	,parseMacroOp: function(e) {
		{
			var _g = this.peek(0);
			var tk = _g;
			switch(_g.tok[1]) {
			case 5:
				var op = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 5:
						switch(_g1.tok[2][1]) {
						case 4:
							if(op == haxe.macro.Binop.OpGt) {
								this.last = this.token.elt;
								this.token = this.token.next;
								op = haxe.macro.Binop.OpGte;
							} else op = op;
							break;
						default:
							op = op;
						}
						break;
					default:
						op = op;
					}
				}
				var o = this.parseMacroCond(true);
				return { tk : o.tk, expr : haxeparser.HaxeParser.makeBinop(op,e,o.expr)};
			default:
				return { tk : haxe.ds.Option.Some(tk), expr : e};
			}
		}
	}
	,enterMacro: function(p) {
		var o = this.parseMacroCond(false);
		var tk;
		{
			var _g = o.tk;
			switch(_g[1]) {
			case 1:
				tk = this.peek(0);
				break;
			case 0:
				var tk1 = _g[2];
				tk = tk1;
				break;
			}
		}
		if(this.isTrue(this["eval"](o.expr))) {
			this.mstack.unshift(p);
			return tk;
		} else return this.skipTokensLoop(p,true,tk);
	}
	,next: function() {
		var tk = hxparse.Parser_haxeparser_HaxeLexer_haxeparser_Token.prototype.peek.call(this,0);
		this.last = this.token.elt;
		this.token = this.token.next;
		return tk;
	}
	,skipTokens: function(p,test) {
		return this.skipTokensLoop(p,test,this.next());
	}
	,skipTokensLoop: function(p,test,tk) {
		switch(tk.tok[1]) {
		case 2:
			switch(tk.tok[2]) {
			case "end":
				return this.peek(0);
			case "elseif":
				if(!test) return this.skipTokens(p,test); else return this.enterMacro(tk.pos);
				break;
			case "else":
				if(!test) return this.skipTokens(p,test); else {
					this.mstack.unshift(tk.pos);
					return this.peek(0);
				}
				break;
			case "if":
				return this.skipTokensLoop(p,test,this.skipTokens(p,false));
			default:
				return this.skipTokens(p,test);
			}
			break;
		case 22:
			throw "unclosed macro";
			break;
		default:
			return this.skipTokens(p,test);
		}
	}
	,isTrue: function(a) {
		switch(a[1]) {
		case 1:
			switch(a[2]) {
			case false:
				return false;
			default:
				return true;
			}
			break;
		case 0:
			return false;
		case 2:
			switch(a[2]) {
			case 0.0:
				return false;
			default:
				return true;
			}
			break;
		case 3:
			switch(a[2]) {
			case "":
				return false;
			default:
				return true;
			}
			break;
		}
	}
	,compare: function(a,b) {
		switch(a[1]) {
		case 0:
			switch(b[1]) {
			case 0:
				return 0;
			default:
				return 0;
			}
			break;
		case 2:
			switch(b[1]) {
			case 2:
				var a1 = a[2];
				var b1 = b[2];
				return Reflect.compare(a1,b1);
			case 3:
				var a2 = a[2];
				var b2 = b[2];
				return Reflect.compare(a2,Std.parseFloat(b2));
			default:
				return 0;
			}
			break;
		case 3:
			switch(b[1]) {
			case 3:
				var a3 = a[2];
				var b3 = b[2];
				return Reflect.compare(a3,b3);
			case 2:
				var a4 = a[2];
				var b4 = b[2];
				return Reflect.compare(Std.parseFloat(a4),b4);
			default:
				return 0;
			}
			break;
		case 1:
			switch(b[1]) {
			case 1:
				var a5 = a[2];
				var b5 = b[2];
				return Reflect.compare(a5,b5);
			default:
				return 0;
			}
			break;
		}
	}
	,'eval': function(e) {
		{
			var _g = e.expr;
			switch(_g[1]) {
			case 0:
				switch(_g[2][1]) {
				case 3:
					var s = _g[2][2];
					if(this.defines.exists(s)) return haxeparser.SmallType.SString(s); else return haxeparser.SmallType.SNull;
					break;
				case 2:
					var s1 = _g[2][2];
					return haxeparser.SmallType.SString(s1);
				case 0:
					var f = _g[2][2];
					return haxeparser.SmallType.SFloat(Std.parseFloat(f));
				case 1:
					var f = _g[2][2];
					return haxeparser.SmallType.SFloat(Std.parseFloat(f));
				default:
					throw "Invalid condition expression";
				}
				break;
			case 2:
				var op = _g[2];
				switch(_g[2][1]) {
				case 14:
					var e2 = _g[4];
					var e1 = _g[3];
					return haxeparser.SmallType.SBool(this.isTrue(this["eval"](e1)) && this.isTrue(this["eval"](e2)));
				case 15:
					var e21 = _g[4];
					var e11 = _g[3];
					return haxeparser.SmallType.SBool(this.isTrue(this["eval"](e11)) || this.isTrue(this["eval"](e21)));
				default:
					var e22 = _g[4];
					var e12 = _g[3];
					var v1 = this["eval"](e12);
					var v2 = this["eval"](e22);
					var cmp = this.compare(v1,v2);
					var val;
					switch(op[1]) {
					case 5:
						val = cmp == 0;
						break;
					case 6:
						val = cmp != 0;
						break;
					case 7:
						val = cmp > 0;
						break;
					case 8:
						val = cmp >= 0;
						break;
					case 9:
						val = cmp < 0;
						break;
					case 10:
						val = cmp <= 0;
						break;
					default:
						throw "Unsupported operation";
					}
					return haxeparser.SmallType.SBool(val);
				}
				break;
			case 9:
				switch(_g[2][1]) {
				case 2:
					var e3 = _g[4];
					return haxeparser.SmallType.SBool(!this.isTrue(this["eval"](e3)));
				default:
					throw "Invalid condition expression";
				}
				break;
			case 4:
				var e4 = _g[2];
				return this["eval"](e4);
			default:
				throw "Invalid condition expression";
			}
		}
	}
	,psep: function(sep,f) {
		var _g = this;
		var acc = [];
		while(true) try {
			acc.push(f());
			var def = function() {
				throw new hxparse.NoMatch(_g.stream.curPos(),_g.peek(0));
			};
			{
				var _g1 = this.peek(0);
				var sep2 = _g1.tok;
				if(sep2 == sep) {
					this.last = this.token.elt;
					this.token = this.token.next;
					null;
				} else def();
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
				break;
			} else throw(e);
		}
		return acc;
	}
	,popt: function(f) {
		try {
			var v = f();
			return v;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				return null;
			} else throw(_);
		}
	}
	,plist: function(f) {
		var acc = [];
		try {
			while(true) acc.push(f());
		} catch( e ) {
			if( js.Boot.__instanceof(e,hxparse.NoMatch) ) {
			} else throw(e);
		}
		return acc;
	}
	,ident: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,dollarIdent: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 3:
				var p1 = _g.pos;
				var i1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : "$" + i1, pos : p1};
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,dollarIdentMacro: function(pack) {
		var _g1 = this;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					var def = function() {
						throw new hxparse.NoMatch(_g1.stream.curPos(),_g1.peek(0));
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 0:
							switch(_g11.tok[2][1]) {
							case 41:
								var p1 = _g11.pos;
								if(pack.length > 0) {
									this.last = this.token.elt;
									this.token = this.token.next;
									return { name : "macro", pos : p1};
								} else return def();
								break;
							default:
								return def();
							}
							break;
						default:
							return def();
						}
					}
				}
				break;
			case 3:
				var p2 = _g.pos;
				var i1 = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : "$" + i1, pos : p2};
			default:
				var def = function() {
					throw new hxparse.NoMatch(_g1.stream.curPos(),_g1.peek(0));
				};
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 0:
						switch(_g11.tok[2][1]) {
						case 41:
							var p1 = _g11.pos;
							if(pack.length > 0) {
								this.last = this.token.elt;
								this.token = this.token.next;
								return { name : "macro", pos : p1};
							} else return def();
							break;
						default:
							return def();
						}
						break;
					default:
						return def();
					}
				}
			}
		}
	}
	,lowerIdentOrMacro: function() {
		var _g = this;
		var def = function() {
			{
				var _g1 = _g.peek(0);
				switch(_g1.tok[1]) {
				case 0:
					switch(_g1.tok[2][1]) {
					case 41:
						_g.last = _g.token.elt;
						_g.token = _g.token.next;
						return "macro";
					default:
						throw new hxparse.NoMatch(_g.stream.curPos(),_g.peek(0));
					}
					break;
				default:
					throw new hxparse.NoMatch(_g.stream.curPos(),_g.peek(0));
				}
			}
		};
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 1:
				switch(_g2.tok[2][1]) {
				case 3:
					var i = _g2.tok[2][2];
					if(haxeparser.HaxeParser.isLowerIdent(i)) {
						this.last = this.token.elt;
						this.token = this.token.next;
						return i;
					} else return def();
					break;
				default:
					return def();
				}
				break;
			default:
				return def();
			}
		}
	}
	,anyEnumIdent: function() {
		try {
			var i = this.ident();
			return i;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 0:
						var p = _g.pos;
						var k = _g.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return { name : k[0].toLowerCase(), pos : p};
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
			} else throw(_);
		}
	}
	,propertyIdent: function() {
		try {
			var i = this.ident();
			return i.name;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 0:
						switch(_g.tok[2][1]) {
						case 33:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "dynamic";
						case 16:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "default";
						case 37:
							this.last = this.token.elt;
							this.token = this.token.next;
							return "null";
						default:
							throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
						}
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
			} else throw(_);
		}
	}
	,getDoc: function() {
		return "";
	}
	,comma: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 13:
				this.last = this.token.elt;
				this.token = this.token.next;
				return null;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,semicolon: function() {
		if(this.last.tok == haxeparser.TokenDef.BrClose) {
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 9:
				var p = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return p;
			default:
				return this.last.pos;
			}
		} else {
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 9:
				var p1 = _g1.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return p1;
			default:
				var pos = this.last.pos;
				if(this.doResume) return pos; else throw { msg : haxeparser.ParserErrorMsg.MissingSemicolon, pos : pos};
			}
		}
	}
	,parseFile: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 34:
					this.last = this.token.elt;
					this.token = this.token.next;
					var p = this.parsePackage();
					var _ = this.semicolon();
					var l = this.parseTypeDecls(p,[]);
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 22:
							this.last = this.token.elt;
							this.token = this.token.next;
							return { pack : p, decls : l};
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					var l1 = this.parseTypeDecls([],[]);
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 22:
							this.last = this.token.elt;
							this.token = this.token.next;
							return { pack : [], decls : l1};
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
				}
				break;
			default:
				var l1 = this.parseTypeDecls([],[]);
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 22:
						this.last = this.token.elt;
						this.token = this.token.next;
						return { pack : [], decls : l1};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
			}
		}
	}
	,parseTypeDecls: function(pack,acc) {
		try {
			var v = this.parseTypeDecl();
			var l = this.parseTypeDecls(pack,haxeparser.HaxeParser.aadd(acc,v.decl));
			return l;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				return acc;
			} else throw(_);
		}
	}
	,parseTypeDecl: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 13:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.parseImport(p1);
				case 36:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseTypePath();
					var p2 = this.semicolon();
					return { decl : haxeparser.TypeDef.EUsing(t), pos : haxeparser.HaxeParser.punion(p11,p2)};
				default:
					var meta = this.parseMeta();
					var c = this.parseCommonFlags();
					try {
						var flags = this.parseEnumFlags();
						var doc = this.getDoc();
						var name = this.typeName();
						var tl = this.parseConstraintParams();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 16:
								this.last = this.token.elt;
								this.token = this.token.next;
								var l = this.plist($bind(this,this.parseEnum));
								{
									var _g2 = this.peek(0);
									switch(_g2.tok[1]) {
									case 17:
										var p21 = _g2.pos;
										this.last = this.token.elt;
										this.token = this.token.next;
										return { decl : haxeparser.TypeDef.EEnum({ name : name, doc : doc, meta : meta, params : tl, flags : c.map(function(i) {
											return i.e;
										}).concat(flags.flags), data : l}), pos : haxeparser.HaxeParser.punion(flags.pos,p21)};
									default:
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									}
								}
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
					} catch( _ ) {
						if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
							try {
								var flags1 = this.parseClassFlags();
								var doc1 = this.getDoc();
								var name1 = this.typeName();
								var tl1 = this.parseConstraintParams();
								var hl = this.plist($bind(this,this.parseClassHerit));
								{
									var _g11 = this.peek(0);
									switch(_g11.tok[1]) {
									case 16:
										this.last = this.token.elt;
										this.token = this.token.next;
										var fl = this.parseClassFields(false,flags1.pos);
										return { decl : haxeparser.TypeDef.EClass({ name : name1, doc : doc1, meta : meta, params : tl1, flags : c.map(function(i1) {
											return i1.c;
										}).concat(flags1.flags).concat(hl), data : fl.fields}), pos : haxeparser.HaxeParser.punion(flags1.pos,fl.pos)};
									default:
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									}
								}
							} catch( _1 ) {
								if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
									{
										var _g12 = this.peek(0);
										switch(_g12.tok[1]) {
										case 0:
											switch(_g12.tok[2][1]) {
											case 32:
												var p12 = _g12.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var doc2 = this.getDoc();
												var name2 = this.typeName();
												var tl2 = this.parseConstraintParams();
												{
													var _g21 = this.peek(0);
													switch(_g21.tok[1]) {
													case 5:
														switch(_g21.tok[2][1]) {
														case 4:
															var p22 = _g21.pos;
															this.last = this.token.elt;
															this.token = this.token.next;
															var t1 = this.parseComplexType();
															{
																var _g3 = this.peek(0);
																switch(_g3.tok[1]) {
																case 9:
																	this.last = this.token.elt;
																	this.token = this.token.next;
																	null;
																	break;
																default:
																	null;
																}
															}
															return { decl : haxeparser.TypeDef.ETypedef({ name : name2, doc : doc2, meta : meta, params : tl2, flags : c.map(function(i2) {
																return i2.e;
															}), data : t1}), pos : haxeparser.HaxeParser.punion(p12,p22)};
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 40:
												var p13 = _g12.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var name3 = this.typeName();
												var tl3 = this.parseConstraintParams();
												var st = this.parseAbstractSubtype();
												var sl = this.plist($bind(this,this.parseAbstractRelations));
												{
													var _g22 = this.peek(0);
													switch(_g22.tok[1]) {
													case 16:
														this.last = this.token.elt;
														this.token = this.token.next;
														var fl1 = this.parseClassFields(false,p13);
														var flags2 = c.map(function(flag) {
															var _g31 = flag.e;
															switch(_g31[1]) {
															case 0:
																return haxeparser.AbstractFlag.APrivAbstract;
															case 1:
																throw "extern abstract is not allowed";
																break;
															}
														});
														if(st != null) flags2.push(haxeparser.AbstractFlag.AIsType(st));
														return { decl : haxeparser.TypeDef.EAbstract({ name : name3, doc : this.doc, meta : meta, params : tl3, flags : flags2.concat(sl), data : fl1.fields}), pos : haxeparser.HaxeParser.punion(p13,fl1.pos)};
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											default:
												throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
											}
											break;
										default:
											throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
										}
									}
								} else throw(_1);
							}
						} else throw(_);
					}
				}
				break;
			default:
				var meta = this.parseMeta();
				var c = this.parseCommonFlags();
				try {
					var flags = this.parseEnumFlags();
					var doc = this.getDoc();
					var name = this.typeName();
					var tl = this.parseConstraintParams();
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 16:
							this.last = this.token.elt;
							this.token = this.token.next;
							var l = this.plist($bind(this,this.parseEnum));
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 17:
									var p21 = _g2.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									return { decl : haxeparser.TypeDef.EEnum({ name : name, doc : doc, meta : meta, params : tl, flags : c.map(function(i) {
										return i.e;
									}).concat(flags.flags), data : l}), pos : haxeparser.HaxeParser.punion(flags.pos,p21)};
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
				} catch( _ ) {
					if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
						try {
							var flags1 = this.parseClassFlags();
							var doc1 = this.getDoc();
							var name1 = this.typeName();
							var tl1 = this.parseConstraintParams();
							var hl = this.plist($bind(this,this.parseClassHerit));
							{
								var _g11 = this.peek(0);
								switch(_g11.tok[1]) {
								case 16:
									this.last = this.token.elt;
									this.token = this.token.next;
									var fl = this.parseClassFields(false,flags1.pos);
									return { decl : haxeparser.TypeDef.EClass({ name : name1, doc : doc1, meta : meta, params : tl1, flags : c.map(function(i1) {
										return i1.c;
									}).concat(flags1.flags).concat(hl), data : fl.fields}), pos : haxeparser.HaxeParser.punion(flags1.pos,fl.pos)};
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
						} catch( _1 ) {
							if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
								{
									var _g12 = this.peek(0);
									switch(_g12.tok[1]) {
									case 0:
										switch(_g12.tok[2][1]) {
										case 32:
											var p12 = _g12.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var doc2 = this.getDoc();
											var name2 = this.typeName();
											var tl2 = this.parseConstraintParams();
											{
												var _g21 = this.peek(0);
												switch(_g21.tok[1]) {
												case 5:
													switch(_g21.tok[2][1]) {
													case 4:
														var p22 = _g21.pos;
														this.last = this.token.elt;
														this.token = this.token.next;
														var t1 = this.parseComplexType();
														{
															var _g3 = this.peek(0);
															switch(_g3.tok[1]) {
															case 9:
																this.last = this.token.elt;
																this.token = this.token.next;
																null;
																break;
															default:
																null;
															}
														}
														return { decl : haxeparser.TypeDef.ETypedef({ name : name2, doc : doc2, meta : meta, params : tl2, flags : c.map(function(i2) {
															return i2.e;
														}), data : t1}), pos : haxeparser.HaxeParser.punion(p12,p22)};
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 40:
											var p13 = _g12.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var name3 = this.typeName();
											var tl3 = this.parseConstraintParams();
											var st = this.parseAbstractSubtype();
											var sl = this.plist($bind(this,this.parseAbstractRelations));
											{
												var _g22 = this.peek(0);
												switch(_g22.tok[1]) {
												case 16:
													this.last = this.token.elt;
													this.token = this.token.next;
													var fl1 = this.parseClassFields(false,p13);
													var flags2 = c.map(function(flag) {
														var _g31 = flag.e;
														switch(_g31[1]) {
														case 0:
															return haxeparser.AbstractFlag.APrivAbstract;
														case 1:
															throw "extern abstract is not allowed";
															break;
														}
													});
													if(st != null) flags2.push(haxeparser.AbstractFlag.AIsType(st));
													return { decl : haxeparser.TypeDef.EAbstract({ name : name3, doc : this.doc, meta : meta, params : tl3, flags : flags2.concat(sl), data : fl1.fields}), pos : haxeparser.HaxeParser.punion(p13,fl1.pos)};
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										default:
											throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
										}
										break;
									default:
										throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
									}
								}
							} else throw(_1);
						}
					} else throw(_);
				}
			}
		}
	}
	,parseClass: function(meta,cflags,needName) {
		var _g = this;
		var optName;
		if(needName) optName = $bind(this,this.typeName); else optName = function() {
			var t = _g.popt($bind(_g,_g.typeName));
			if(t == null) return ""; else return t;
		};
		var flags = this.parseClassFlags();
		var doc = this.getDoc();
		var name = optName();
		var tl = this.parseConstraintParams();
		var hl = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseClassHerit));
		{
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 16:
				this.last = this.token.elt;
				this.token = this.token.next;
				var fl = this.parseClassFields(false,flags.pos);
				return { decl : haxeparser.TypeDef.EClass({ name : name, doc : doc, meta : meta, params : tl, flags : cflags.map(function(i) {
					return i.fst;
				}).concat(flags.flags).concat(hl), data : fl.fields}), pos : haxeparser.HaxeParser.punion(flags.pos,fl.pos)};
			default:
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		}
	}
	,parseImport: function(p1) {
		var acc;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					acc = [{ pack : name, pos : p}];
					break;
				default:
					throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
				break;
			default:
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		}
		while(true) {
			var _g1 = this.peek(0);
			switch(_g1.tok[1]) {
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 1:
						switch(_g11.tok[2][1]) {
						case 3:
							var p2 = _g11.pos;
							var k = _g11.tok[2][2];
							this.last = this.token.elt;
							this.token = this.token.next;
							acc.push({ pack : k, pos : p2});
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
						break;
					case 0:
						switch(_g11.tok[2][1]) {
						case 41:
							var p3 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							acc.push({ pack : "macro", pos : p3});
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
						break;
					case 5:
						switch(_g11.tok[2][1]) {
						case 1:
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 9:
									var p21 = _g2.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									return { decl : haxeparser.TypeDef.EImport(acc,haxeparser.ImportMode.IAll), pos : p21};
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
						break;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 9:
				var p22 = _g1.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				return { decl : haxeparser.TypeDef.EImport(acc,haxeparser.ImportMode.INormal), pos : p22};
			case 0:
				switch(_g1.tok[2][1]) {
				case 27:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g12 = this.peek(0);
						switch(_g12.tok[1]) {
						case 1:
							switch(_g12.tok[2][1]) {
							case 3:
								var name1 = _g12.tok[2][2];
								this.last = this.token.elt;
								this.token = this.token.next;
								{
									var _g21 = this.peek(0);
									switch(_g21.tok[1]) {
									case 9:
										var p23 = _g21.pos;
										this.last = this.token.elt;
										this.token = this.token.next;
										return { decl : haxeparser.TypeDef.EImport(acc,haxeparser.ImportMode.IAsName(name1)), pos : p23};
									default:
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									}
								}
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
				break;
			default:
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		}
	}
	,parseAbstractRelations: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					switch(_g.tok[2][2]) {
					case "to":
						this.last = this.token.elt;
						this.token = this.token.next;
						var t = this.parseComplexType();
						return haxeparser.AbstractFlag.AToType(t);
					case "from":
						this.last = this.token.elt;
						this.token = this.token.next;
						var t1 = this.parseComplexType();
						return haxeparser.AbstractFlag.AFromType(t1);
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseAbstractSubtype: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						return t;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			default:
				return null;
			}
		}
	}
	,parsePackage: function() {
		return this.psep(haxeparser.TokenDef.Dot,$bind(this,this.lowerIdentOrMacro));
	}
	,parseClassFields: function(tdecl,p1) {
		var l = this.parseClassFieldResume(tdecl);
		var p2;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 17:
				var p21 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				p2 = p21;
				break;
			default:
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		}
		return { fields : l, pos : p2};
	}
	,parseClassFieldResume: function(tdecl) {
		return this.plist($bind(this,this.parseClassField));
	}
	,parseCommonFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 19:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l = this.parseCommonFlags();
					return haxeparser.HaxeParser.aadd(l,{ c : haxeparser.ClassFlag.HPrivate, e : haxeparser.EnumFlag.EPrivate});
				case 25:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l1 = this.parseCommonFlags();
					return haxeparser.HaxeParser.aadd(l1,{ c : haxeparser.ClassFlag.HExtern, e : haxeparser.EnumFlag.EExtern});
				default:
					return [];
				}
				break;
			default:
				return [];
			}
		}
	}
	,parseMetaParams: function(pname) {
		var def = function() {
			return [];
		};
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				var p = _g.pos;
				if(p.min == pname.max) {
					this.last = this.token.elt;
					this.token = this.token.next;
					var params = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.expr));
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 19:
							this.last = this.token.elt;
							this.token = this.token.next;
							return params;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
				} else return def();
				break;
			default:
				return def();
			}
		}
	}
	,parseMetaEntry: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 21:
				this.last = this.token.elt;
				this.token = this.token.next;
				var name = this.metaName();
				var params = this.parseMetaParams(name.pos);
				return { name : name.name, params : params, pos : name.pos};
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseMeta: function() {
		try {
			var entry = this.parseMetaEntry();
			return haxeparser.HaxeParser.aadd(this.parseMeta(),entry);
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				return [];
			} else throw(_);
		}
	}
	,metaName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var i = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return { name : i, pos : p};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 0:
				var p1 = _g.pos;
				var k = _g.tok[2];
				this.last = this.token.elt;
				this.token = this.token.next;
				return { name : k[0].toLowerCase(), pos : p1};
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 1:
						switch(_g1.tok[2][1]) {
						case 3:
							var p2 = _g1.pos;
							var i1 = _g1.tok[2][2];
							this.last = this.token.elt;
							this.token = this.token.next;
							return { name : ":" + i1, pos : p2};
						default:
							throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
						}
						break;
					default:
						throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
					}
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseEnumFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 26:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : [], pos : p};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseClassFlags: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 1:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : [], pos : p};
				case 28:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { flags : haxeparser.HaxeParser.aadd([],haxeparser.ClassFlag.HInterface), pos : p1};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseTypeOpt: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				return t;
			default:
				return null;
			}
		}
	}
	,parseComplexType: function() {
		var t = this.parseComplexTypeInner();
		return this.parseComplexTypeNext(t);
	}
	,parseComplexTypeInner: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						return haxe.macro.ComplexType.TParent(t);
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 16:
				var p1 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				try {
					var l = this.parseTypeAnonymous(false);
					return haxe.macro.ComplexType.TAnonymous(l);
				} catch( _ ) {
					if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
						{
							var _g11 = this.peek(0);
							switch(_g11.tok[1]) {
							case 5:
								switch(_g11.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t1 = this.parseTypePath();
									{
										var _g2 = this.peek(0);
										switch(_g2.tok[1]) {
										case 13:
											this.last = this.token.elt;
											this.token = this.token.next;
											try {
												var l1 = this.parseTypeAnonymous(false);
												return haxe.macro.ComplexType.TExtend([t1],l1);
											} catch( _1 ) {
												if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
													try {
														var fl = this.parseClassFields(true,p1);
														return haxe.macro.ComplexType.TExtend([t1],fl.fields);
													} catch( _2 ) {
														if( js.Boot.__instanceof(_2,hxparse.NoMatch) ) {
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														} else throw(_2);
													}
												} else throw(_1);
											}
											break;
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									break;
								default:
									try {
										var l2 = this.parseClassFields(true,p1);
										return haxe.macro.ComplexType.TAnonymous(l2.fields);
									} catch( _3 ) {
										if( js.Boot.__instanceof(_3,hxparse.NoMatch) ) {
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										} else throw(_3);
									}
								}
								break;
							default:
								try {
									var l2 = this.parseClassFields(true,p1);
									return haxe.macro.ComplexType.TAnonymous(l2.fields);
								} catch( _3 ) {
									if( js.Boot.__instanceof(_3,hxparse.NoMatch) ) {
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									} else throw(_3);
								}
							}
						}
					} else throw(_);
				}
				break;
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t2 = this.parseComplexTypeInner();
				return haxe.macro.ComplexType.TOptional(t2);
			default:
				var t3 = this.parseTypePath();
				return haxe.macro.ComplexType.TPath(t3);
			}
		}
	}
	,parseTypePath: function() {
		return this.parseTypePath1([]);
	}
	,parseTypePath1: function(pack) {
		var _g1 = this;
		var ident = this.dollarIdentMacro(pack);
		if(haxeparser.HaxeParser.isLowerIdent(ident.name)) {
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 10:
				this.last = this.token.elt;
				this.token = this.token.next;
				return this.parseTypePath1(haxeparser.HaxeParser.aadd(pack,ident.name));
			case 9:
				this.last = this.token.elt;
				this.token = this.token.next;
				throw { msg : haxeparser.ParserErrorMsg.Custom("Type name should start with an uppercase letter"), pos : ident.pos};
				break;
			default:
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		} else {
			var sub;
			{
				var _g2 = this.peek(0);
				switch(_g2.tok[1]) {
				case 10:
					this.last = this.token.elt;
					this.token = this.token.next;
					var def = function() {
						throw new hxparse.Unexpected(_g1.peek(0),_g1.stream.curPos());
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 1:
							switch(_g11.tok[2][1]) {
							case 3:
								var name = _g11.tok[2][2];
								if(!haxeparser.HaxeParser.isLowerIdent(name)) {
									this.last = this.token.elt;
									this.token = this.token.next;
									sub = name;
								} else sub = def();
								break;
							default:
								sub = def();
							}
							break;
						default:
							sub = def();
						}
					}
					break;
				default:
					sub = null;
				}
			}
			var params;
			{
				var _g3 = this.peek(0);
				switch(_g3.tok[1]) {
				case 5:
					switch(_g3.tok[2][1]) {
					case 9:
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseTypePathOrConst));
						{
							var _g12 = this.peek(0);
							switch(_g12.tok[1]) {
							case 5:
								switch(_g12.tok[2][1]) {
								case 7:
									this.last = this.token.elt;
									this.token = this.token.next;
									params = l;
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
						break;
					default:
						params = [];
					}
					break;
				default:
					params = [];
				}
			}
			return { pack : pack, name : ident.name, params : params, sub : sub};
		}
	}
	,typeName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					if(haxeparser.HaxeParser.isLowerIdent(name)) throw { msg : haxeparser.ParserErrorMsg.Custom("Type name should start with an uppercase letter"), pos : p}; else return name;
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseTypePathOrConst: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 14:
				var p1 = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				var l = this.parseArrayDecl();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 15:
						var p2 = _g1.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						return haxe.macro.TypeParam.TPExpr({ expr : haxe.macro.ExprDef.EArrayDecl(l), pos : haxeparser.HaxeParser.punion(p1,p2)});
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			default:
				try {
					var t = this.parseComplexType();
					return haxe.macro.TypeParam.TPType(t);
				} catch( _ ) {
					if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
						{
							var _g11 = this.peek(0);
							switch(_g11.tok[1]) {
							case 1:
								var p = _g11.pos;
								var c = _g11.tok[2];
								this.last = this.token.elt;
								this.token = this.token.next;
								return haxe.macro.TypeParam.TPExpr({ expr : haxe.macro.ExprDef.EConst(c), pos : p});
							default:
								try {
									var e = this.expr();
									return haxe.macro.TypeParam.TPExpr(e);
								} catch( _1 ) {
									if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									} else throw(_1);
								}
							}
						}
					} else throw(_);
				}
			}
		}
	}
	,parseComplexTypeNext: function(t) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 12:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t2 = this.parseComplexType();
				switch(t2[1]) {
				case 1:
					var r = t2[3];
					var args = t2[2];
					return haxe.macro.ComplexType.TFunction(haxeparser.HaxeParser.aadd(args,t),r);
				default:
					return haxe.macro.ComplexType.TFunction([t],t2);
				}
				break;
			default:
				return t;
			}
		}
	}
	,parseTypeAnonymous: function(opt) {
		var _g = this;
		try {
			var id = this.ident();
			{
				var _g1 = this.peek(0);
				switch(_g1.tok[1]) {
				case 11:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseComplexType();
					var next = function(p2,acc) {
						var t1;
						if(!opt) t1 = t; else switch(t[1]) {
						case 0:
							switch(t[2].pack.length) {
							case 0:
								switch(t[2].name) {
								case "Null":
									t1 = t;
									break;
								default:
									t1 = haxe.macro.ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe.macro.TypeParam.TPType(t)]});
								}
								break;
							default:
								t1 = haxe.macro.ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe.macro.TypeParam.TPType(t)]});
							}
							break;
						default:
							t1 = haxe.macro.ComplexType.TPath({ pack : [], name : "Null", sub : null, params : [haxe.macro.TypeParam.TPType(t)]});
						}
						return haxeparser.HaxeParser.aadd(acc,{ name : id.name, meta : opt?[{ name : ":optional", params : [], pos : id.pos}]:[], access : [], doc : null, kind : haxe.macro.FieldType.FVar(t1,null), pos : haxeparser.HaxeParser.punion(id.pos,p2)});
					};
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 17:
							var p21 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return next(p21,[]);
						case 13:
							var p22 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 17:
									this.last = this.token.elt;
									this.token = this.token.next;
									return next(p22,[]);
								default:
									try {
										var l = this.parseTypeAnonymous(false);
										return next(p22,l);
									} catch( _ ) {
										if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										} else throw(_);
									}
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
			}
		} catch( _1 ) {
			if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
				var def = function() {
					throw new hxparse.NoMatch(_g.stream.curPos(),_g.peek(0));
				};
				{
					var _g3 = this.peek(0);
					switch(_g3.tok[1]) {
					case 20:
						if(!opt) {
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.parseTypeAnonymous(true);
						} else return def();
						break;
					default:
						return def();
					}
				}
			} else throw(_1);
		}
	}
	,parseEnum: function() {
		this.doc = null;
		var meta = this.parseMeta();
		var name = this.anyEnumIdent();
		var doc = this.getDoc();
		var params = this.parseConstraintParams();
		var args;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				var l = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseEnumParam));
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 19:
						this.last = this.token.elt;
						this.token = this.token.next;
						args = l;
						break;
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			default:
				args = [];
			}
		}
		var t;
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t1 = this.parseComplexType();
				t = t1;
				break;
			default:
				t = null;
			}
		}
		var p2;
		try {
			var p = this.semicolon();
			p2 = p;
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			} else throw(_);
		}
		return { name : name.name, doc : doc, meta : meta, args : args, params : params, type : t, pos : haxeparser.HaxeParser.punion(name.pos,p2)};
	}
	,parseEnumParam: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var name = this.ident();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t = this.parseComplexType();
						return { name : name.name, opt : true, type : t};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			default:
				var name1 = this.ident();
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t1 = this.parseComplexType();
						return { name : name1.name, opt : false, type : t1};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
			}
		}
	}
	,parseClassField: function() {
		this.doc = null;
		var meta = this.parseMeta();
		var al = this.parseCfRights(true,[]);
		var doc = this.getDoc();
		var data;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var name = this.ident();
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var i1 = this.propertyIdent();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 13:
									this.last = this.token.elt;
									this.token = this.token.next;
									var i2 = this.propertyIdent();
									{
										var _g3 = this.peek(0);
										switch(_g3.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t;
											{
												var _g4 = this.peek(0);
												switch(_g4.tok[1]) {
												case 11:
													this.last = this.token.elt;
													this.token = this.token.next;
													var t1 = this.parseComplexType();
													t = t1;
													break;
												default:
													t = null;
												}
											}
											var e;
											{
												var _g41 = this.peek(0);
												switch(_g41.tok[1]) {
												case 5:
													switch(_g41.tok[2][1]) {
													case 4:
														this.last = this.token.elt;
														this.token = this.token.next;
														var e1 = this.toplevelExpr();
														var p2 = this.semicolon();
														e = { expr : e1, pos : p2};
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
													break;
												case 9:
													var p21 = _g41.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													e = { expr : null, pos : p21};
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											data = { name : name.name, pos : haxeparser.HaxeParser.punion(p1,e.pos), kind : haxe.macro.FieldType.FProp(i1,i2,t,e.expr)};
											break;
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							var t2 = this.parseTypeOpt();
							var e2;
							{
								var _g21 = this.peek(0);
								switch(_g21.tok[1]) {
								case 5:
									switch(_g21.tok[2][1]) {
									case 4:
										this.last = this.token.elt;
										this.token = this.token.next;
										var e3 = this.toplevelExpr();
										var p22 = this.semicolon();
										e2 = { expr : e3, pos : p22};
										break;
									default:
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									}
									break;
								case 9:
									var p23 = _g21.pos;
									this.last = this.token.elt;
									this.token = this.token.next;
									e2 = { expr : null, pos : p23};
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							data = { name : name.name, pos : haxeparser.HaxeParser.punion(p1,e2.pos), kind : haxe.macro.FieldType.FVar(t2,e2.expr)};
						}
					}
					break;
				case 0:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var name1 = this.parseFunName();
					var pl = this.parseConstraintParams();
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var al1 = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseFunParam));
							{
								var _g22 = this.peek(0);
								switch(_g22.tok[1]) {
								case 19:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t3 = this.parseTypeOpt();
									var e4;
									try {
										var e5 = this.toplevelExpr();
										var _ = this.semicolon();
										e4 = { expr : e5, pos : e5.pos};
									} catch( _1 ) {
										if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
											{
												var _g31 = this.peek(0);
												switch(_g31.tok[1]) {
												case 9:
													var p = _g31.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													e4 = { expr : null, pos : p};
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
										} else throw(_1);
									}
									var f = { params : pl, args : al1, ret : t3, expr : e4.expr};
									data = { name : name1, pos : haxeparser.HaxeParser.punion(p11,e4.pos), kind : haxe.macro.FieldType.FFun(f)};
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					if(al.length == 0) throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0)); else throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
				}
				break;
			default:
				if(al.length == 0) throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0)); else throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
			}
		}
		return { name : data.name, doc : doc, meta : meta, access : al, pos : data.pos, kind : data.kind};
	}
	,parseCfRights: function(allowStatic,l) {
		var _g = this;
		var def = function() {
			var def1 = function() {
				var def2 = function() {
					var def3 = function() {
						var def4 = function() {
							var def5 = function() {
								{
									var _g1 = _g.peek(0);
									switch(_g1.tok[1]) {
									case 0:
										switch(_g1.tok[2][1]) {
										case 35:
											_g.last = _g.token.elt;
											_g.token = _g.token.next;
											var l1 = _g.parseCfRights(allowStatic,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.AInline));
											return l1;
										default:
											return l;
										}
										break;
									default:
										return l;
									}
								}
							};
							{
								var _g11 = _g.peek(0);
								switch(_g11.tok[1]) {
								case 0:
									switch(_g11.tok[2][1]) {
									case 33:
										if(!Lambda.has(l,haxe.macro.Access.ADynamic)) {
											_g.last = _g.token.elt;
											_g.token = _g.token.next;
											var l2 = _g.parseCfRights(allowStatic,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.ADynamic));
											return l2;
										} else return def5();
										break;
									default:
										return def5();
									}
									break;
								default:
									return def5();
								}
							}
						};
						{
							var _g12 = _g.peek(0);
							switch(_g12.tok[1]) {
							case 0:
								switch(_g12.tok[2][1]) {
								case 31:
									if(!Lambda.has(l,haxe.macro.Access.AOverride)) {
										_g.last = _g.token.elt;
										_g.token = _g.token.next;
										var l3 = _g.parseCfRights(false,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.AOverride));
										return l3;
									} else return def4();
									break;
								default:
									return def4();
								}
								break;
							default:
								return def4();
							}
						}
					};
					{
						var _g13 = _g.peek(0);
						switch(_g13.tok[1]) {
						case 0:
							switch(_g13.tok[2][1]) {
							case 19:
								if(!(Lambda.has(l,haxe.macro.Access.APublic) || Lambda.has(l,haxe.macro.Access.APrivate))) {
									_g.last = _g.token.elt;
									_g.token = _g.token.next;
									var l4 = _g.parseCfRights(allowStatic,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.APrivate));
									return l4;
								} else return def3();
								break;
							default:
								return def3();
							}
							break;
						default:
							return def3();
						}
					}
				};
				{
					var _g14 = _g.peek(0);
					switch(_g14.tok[1]) {
					case 0:
						switch(_g14.tok[2][1]) {
						case 18:
							if(!(Lambda.has(l,haxe.macro.Access.APublic) || Lambda.has(l,haxe.macro.Access.APrivate))) {
								_g.last = _g.token.elt;
								_g.token = _g.token.next;
								var l5 = _g.parseCfRights(allowStatic,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.APublic));
								return l5;
							} else return def2();
							break;
						default:
							return def2();
						}
						break;
					default:
						return def2();
					}
				}
			};
			{
				var _g15 = _g.peek(0);
				switch(_g15.tok[1]) {
				case 0:
					switch(_g15.tok[2][1]) {
					case 41:
						if(!Lambda.has(l,haxe.macro.Access.AMacro)) {
							_g.last = _g.token.elt;
							_g.token = _g.token.next;
							var l6 = _g.parseCfRights(allowStatic,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.AMacro));
							return l6;
						} else return def1();
						break;
					default:
						return def1();
					}
					break;
				default:
					return def1();
				}
			}
		};
		{
			var _g2 = this.peek(0);
			switch(_g2.tok[1]) {
			case 0:
				switch(_g2.tok[2][1]) {
				case 17:
					if(allowStatic) {
						this.last = this.token.elt;
						this.token = this.token.next;
						var l7 = this.parseCfRights(false,haxeparser.HaxeParser.aadd(l,haxe.macro.Access.AStatic));
						return l7;
					} else return def();
					break;
				default:
					return def();
				}
				break;
			default:
				return def();
			}
		}
	}
	,parseFunName: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return name;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 22:
					this.last = this.token.elt;
					this.token = this.token.next;
					return "new";
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseFunParam: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var id = this.ident();
				var t = this.parseTypeOpt();
				var c = this.parseFunParamValue();
				return { name : id.name, opt : true, type : t, value : c};
			default:
				var id1 = this.ident();
				var t1 = this.parseTypeOpt();
				var c1 = this.parseFunParamValue();
				return { name : id1.name, opt : false, type : t1, value : c1};
			}
		}
	}
	,parseFunParamValue: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 4:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e = this.toplevelExpr();
					return e;
				default:
					return null;
				}
				break;
			default:
				return null;
			}
		}
	}
	,parseFunParamType: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var id = this.ident();
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t = this.parseComplexType();
						return { name : id.name, opt : true, type : t};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			default:
				var id1 = this.ident();
				{
					var _g11 = this.peek(0);
					switch(_g11.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var t1 = this.parseComplexType();
						return { name : id1.name, opt : false, type : t1};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
			}
		}
	}
	,parseConstraintParams: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 9:
					this.last = this.token.elt;
					this.token = this.token.next;
					var l = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseConstraintParam));
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 5:
							switch(_g1.tok[2][1]) {
							case 7:
								this.last = this.token.elt;
								this.token = this.token.next;
								return l;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					return [];
				}
				break;
			default:
				return [];
			}
		}
	}
	,parseConstraintParam: function() {
		var name = this.typeName();
		var params = [];
		var ctl;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 18:
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseComplexType));
						{
							var _g2 = this.peek(0);
							switch(_g2.tok[1]) {
							case 19:
								this.last = this.token.elt;
								this.token = this.token.next;
								ctl = l;
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
						break;
					default:
						try {
							var t = this.parseComplexType();
							ctl = [t];
						} catch( _ ) {
							if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							} else throw(_);
						}
					}
				}
				break;
			default:
				ctl = [];
			}
		}
		return { name : name, params : params, constraints : ctl};
	}
	,parseClassHerit: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 11:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t = this.parseTypePath();
					return haxeparser.ClassFlag.HExtends(t);
				case 12:
					this.last = this.token.elt;
					this.token = this.token.next;
					var t1 = this.parseTypePath();
					return haxeparser.ClassFlag.HImplements(t1);
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,block1: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 1:
				switch(_g.tok[2][1]) {
				case 3:
					var p = _g.pos;
					var name = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.block2(name,haxe.macro.Constant.CIdent(name),p);
				case 2:
					var p1 = _g.pos;
					var name1 = _g.tok[2][2];
					this.last = this.token.elt;
					this.token = this.token.next;
					return this.block2(haxeparser.HaxeParser.quoteIdent(name1),haxe.macro.Constant.CString(name1),p1);
				default:
					var b = this.block([]);
					return haxe.macro.ExprDef.EBlock(b);
				}
				break;
			default:
				var b = this.block([]);
				return haxe.macro.ExprDef.EBlock(b);
			}
		}
	}
	,block2: function(name,ident,p) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e = this.expr();
				var l = this.parseObjDecl();
				l.unshift({ field : name, expr : e});
				return haxe.macro.ExprDef.EObjectDecl(l);
			default:
				var e1 = this.exprNext({ expr : haxe.macro.ExprDef.EConst(ident), pos : p});
				var _ = this.semicolon();
				var b = this.block([e1]);
				return haxe.macro.ExprDef.EBlock(b);
			}
		}
	}
	,block: function(acc) {
		try {
			var e = this.parseBlockElt();
			return this.block(haxeparser.HaxeParser.aadd(acc,e));
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hxparse.NoMatch) ) {
				return acc;
			} else throw(e1);
		}
	}
	,parseBlockElt: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var vl = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseVarDecl));
					var p2 = this.semicolon();
					return { expr : haxe.macro.ExprDef.EVars(vl), pos : haxeparser.HaxeParser.punion(p1,p2)};
				default:
					var e = this.expr();
					var _ = this.semicolon();
					return e;
				}
				break;
			default:
				var e = this.expr();
				var _ = this.semicolon();
				return e;
			}
		}
	}
	,parseObjDecl: function() {
		var acc = [];
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 13:
					this.last = this.token.elt;
					this.token = this.token.next;
					try {
						var id = this.ident();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 11:
								this.last = this.token.elt;
								this.token = this.token.next;
								var e = this.expr();
								acc.push({ field : id.name, expr : e});
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
					} catch( _ ) {
						if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
							{
								var _g11 = this.peek(0);
								switch(_g11.tok[1]) {
								case 1:
									switch(_g11.tok[2][1]) {
									case 2:
										var name = _g11.tok[2][2];
										this.last = this.token.elt;
										this.token = this.token.next;
										{
											var _g2 = this.peek(0);
											switch(_g2.tok[1]) {
											case 11:
												this.last = this.token.elt;
												this.token = this.token.next;
												var e1 = this.expr();
												acc.push({ field : haxeparser.HaxeParser.quoteIdent(name), expr : e1});
												break;
											default:
												throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
											}
										}
										break;
									default:
										throw "__break__";
									}
									break;
								default:
									throw "__break__";
								}
							}
						} else throw(_);
					}
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return acc;
	}
	,parseArrayDecl: function() {
		var acc = [];
		var br = false;
		while(true) {
			try {
				var e = this.expr();
				acc.push(e);
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 13:
						this.last = this.token.elt;
						this.token = this.token.next;
						null;
						break;
					default:
						br = true;
					}
				}
			} catch( _ ) {
				if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
					br = true;
				} else throw(_);
			}
			if(br) break;
		}
		return acc;
	}
	,parseVarDecl: function() {
		var id = this.dollarIdent();
		var t = this.parseTypeOpt();
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 5:
				switch(_g.tok[2][1]) {
				case 4:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e = this.expr();
					return { name : id.name, type : t, expr : e};
				default:
					return { name : id.name, type : t, expr : null};
				}
				break;
			default:
				return { name : id.name, type : t, expr : null};
			}
		}
	}
	,inlineFunction: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 35:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 0:
							switch(_g1.tok[2][1]) {
							case 0:
								var p1 = _g1.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return { isInline : true, pos : p1};
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				case 0:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					return { isInline : false, pos : p11};
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,reify: function(inMacro) {
		return { toExpr : function(e) {
			return null;
		}, toType : function(t,p) {
			return null;
		}, toTypeDef : function(t1) {
			return null;
		}};
	}
	,reifyExpr: function(e) {
		var toExpr = this.reify(this.inMacro).toExpr;
		var e1 = toExpr(e);
		return { expr : haxe.macro.ExprDef.ECheckType(e1,haxe.macro.ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : null, params : []})), pos : e1.pos};
	}
	,parseMacroExpr: function(p) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 11:
				this.last = this.token.elt;
				this.token = this.token.next;
				var t = this.parseComplexType();
				var toType = this.reify(this.inMacro).toType;
				var t1 = toType(t,p);
				return { expr : haxe.macro.ExprDef.ECheckType(t1,haxe.macro.ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : "ComplexType", params : []})), pos : p};
			case 0:
				switch(_g.tok[2][1]) {
				case 2:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var vl = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseVarDecl));
					return this.reifyExpr({ expr : haxe.macro.ExprDef.EVars(vl), pos : p1});
				default:
					var e = this.secureExpr();
					return this.reifyExpr(e);
				}
				break;
			case 14:
				this.last = this.token.elt;
				this.token = this.token.next;
				var d = this.parseClass([],[],false);
				var toType1 = this.reify(this.inMacro).toTypeDef;
				return { expr : haxe.macro.ExprDef.ECheckType(toType1(d),haxe.macro.ComplexType.TPath({ pack : ["haxe","macro"], name : "Expr", sub : "TypeDefinition", params : []})), pos : p};
			default:
				var e = this.secureExpr();
				return this.reifyExpr(e);
			}
		}
	}
	,expr: function() {
		try {
			var meta = this.parseMetaEntry();
			return haxeparser.HaxeParser.makeMeta(meta.name,meta.params,this.secureExpr(),meta.pos);
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				{
					var _g = this.peek(0);
					switch(_g.tok[1]) {
					case 16:
						var p1 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var b = this.block1();
						{
							var _g1 = this.peek(0);
							switch(_g1.tok[1]) {
							case 17:
								var p2 = _g1.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								var e = { expr : b, pos : haxeparser.HaxeParser.punion(p1,p2)};
								switch(b[1]) {
								case 5:
									return this.exprNext(e);
								default:
									return e;
								}
								break;
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
						break;
					case 0:
						switch(_g.tok[2][1]) {
						case 41:
							var p = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.parseMacroExpr(p);
						case 2:
							var p11 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var v = this.parseVarDecl();
							return { expr : haxe.macro.ExprDef.EVars([v]), pos : p11};
						case 23:
							var p3 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("this")), pos : p3});
						case 38:
							var p4 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("true")), pos : p4});
						case 39:
							var p5 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("false")), pos : p5});
						case 37:
							var p6 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("null")), pos : p6});
						case 30:
							var p12 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							{
								var _g11 = this.peek(0);
								switch(_g11.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									var e1 = this.expr();
									{
										var _g2 = this.peek(0);
										switch(_g2.tok[1]) {
										case 13:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t = this.parseComplexType();
											{
												var _g3 = this.peek(0);
												switch(_g3.tok[1]) {
												case 19:
													var p21 = _g3.pos;
													this.last = this.token.elt;
													this.token = this.token.next;
													return this.exprNext({ expr : haxe.macro.ExprDef.ECast(e1,t), pos : haxeparser.HaxeParser.punion(p12,p21)});
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 19:
											var p22 = _g2.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return this.exprNext({ expr : haxe.macro.ExprDef.ECast(e1,null), pos : haxeparser.HaxeParser.punion(p12,p22)});
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									break;
								default:
									var e2 = this.secureExpr();
									return this.exprNext({ expr : haxe.macro.ExprDef.ECast(e2,null), pos : haxeparser.HaxeParser.punion(p12,e2.pos)});
								}
							}
							break;
						case 24:
							var p7 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var e3 = this.expr();
							return { expr : haxe.macro.ExprDef.EThrow(e3), pos : p7};
						case 22:
							var p13 = _g.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							var t1 = this.parseTypePath();
							{
								var _g12 = this.peek(0);
								switch(_g12.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									try {
										var al = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.expr));
										{
											var _g21 = this.peek(0);
											switch(_g21.tok[1]) {
											case 19:
												var p23 = _g21.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return this.exprNext({ expr : haxe.macro.ExprDef.ENew(t1,al), pos : haxeparser.HaxeParser.punion(p13,p23)});
											default:
												throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
											}
										}
									} catch( _1 ) {
										if( js.Boot.__instanceof(_1,hxparse.NoMatch) ) {
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										} else throw(_1);
									}
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							try {
								var inl = this.inlineFunction();
								var name = this.popt($bind(this,this.dollarIdent));
								var pl = this.parseConstraintParams();
								{
									var _g13 = this.peek(0);
									switch(_g13.tok[1]) {
									case 18:
										this.last = this.token.elt;
										this.token = this.token.next;
										var al1 = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseFunParam));
										{
											var _g22 = this.peek(0);
											switch(_g22.tok[1]) {
											case 19:
												this.last = this.token.elt;
												this.token = this.token.next;
												var t2 = this.parseTypeOpt();
												var make = function(e4) {
													var f = { params : pl, ret : t2, args : al1, expr : e4};
													return { expr : haxe.macro.ExprDef.EFunction(name == null?null:inl.isInline?"inline_" + name.name:name.name,f), pos : haxeparser.HaxeParser.punion(inl.pos,e4.pos)};
												};
												return this.exprNext(make(this.secureExpr()));
											default:
												throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
											}
										}
										break;
									default:
										throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
									}
								}
							} catch( _2 ) {
								if( js.Boot.__instanceof(_2,hxparse.NoMatch) ) {
									{
										var _g14 = this.peek(0);
										switch(_g14.tok[1]) {
										case 4:
											var p14 = _g14.pos;
											var op = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											var e5 = this.expr();
											return haxeparser.HaxeParser.makeUnop(op,e5,p14);
										case 5:
											switch(_g14.tok[2][1]) {
											case 3:
												var p15 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e6 = this.expr();
												var neg = function(s) {
													if(HxOverrides.cca(s,0) == 45) return HxOverrides.substr(s,1,null); else return "-" + s;
												};
												{
													var _g23 = haxeparser.HaxeParser.makeUnop(haxe.macro.Unop.OpNeg,e6,p15);
													var e7 = _g23;
													switch(_g23.expr[1]) {
													case 9:
														switch(_g23.expr[2][1]) {
														case 3:
															switch(_g23.expr[3]) {
															case false:
																switch(_g23.expr[4].expr[1]) {
																case 0:
																	switch(_g23.expr[4].expr[2][1]) {
																	case 0:
																		var p8 = _g23.pos;
																		var i = _g23.expr[4].expr[2][2];
																		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(neg(i))), pos : p8};
																	case 1:
																		var p9 = _g23.pos;
																		var j = _g23.expr[4].expr[2][2];
																		return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(neg(j))), pos : p9};
																	default:
																		return e7;
																	}
																	break;
																default:
																	return e7;
																}
																break;
															default:
																return e7;
															}
															break;
														default:
															return e7;
														}
														break;
													default:
														return e7;
													}
												}
												break;
											default:
												throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
											}
											break;
										case 0:
											switch(_g14.tok[2][1]) {
											case 7:
												var p10 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g24 = this.peek(0);
													switch(_g24.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var it = this.expr();
														{
															var _g31 = this.peek(0);
															switch(_g31.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e8 = this.secureExpr();
																return { expr : haxe.macro.ExprDef.EFor(it,e8), pos : haxeparser.HaxeParser.punion(p10,e8.pos)};
															default:
																throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
															}
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 3:
												var p16 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g25 = this.peek(0);
													switch(_g25.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cond = this.expr();
														{
															var _g32 = this.peek(0);
															switch(_g32.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e11 = this.expr();
																var e21;
																{
																	var _g4 = this.peek(0);
																	switch(_g4.tok[1]) {
																	case 0:
																		switch(_g4.tok[2][1]) {
																		case 4:
																			this.last = this.token.elt;
																			this.token = this.token.next;
																			var e22 = this.expr();
																			e21 = e22;
																			break;
																		default:
																			{
																				var _g5 = this.peek(0);
																				var _g6 = this.peek(1);
																				switch(_g5.tok[1]) {
																				case 9:
																					switch(_g6.tok[1]) {
																					case 0:
																						switch(_g6.tok[2][1]) {
																						case 4:
																							this.last = this.token.elt;
																							this.token = this.token.next;
																							this.last = this.token.elt;
																							this.token = this.token.next;
																							e21 = this.secureExpr();
																							break;
																						default:
																							e21 = null;
																						}
																						break;
																					default:
																						e21 = null;
																					}
																					break;
																				default:
																					e21 = null;
																				}
																			}
																		}
																		break;
																	default:
																		{
																			var _g5 = this.peek(0);
																			var _g6 = this.peek(1);
																			switch(_g5.tok[1]) {
																			case 9:
																				switch(_g6.tok[1]) {
																				case 0:
																					switch(_g6.tok[2][1]) {
																					case 4:
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						e21 = this.secureExpr();
																						break;
																					default:
																						e21 = null;
																					}
																					break;
																				default:
																					e21 = null;
																				}
																				break;
																			default:
																				e21 = null;
																			}
																		}
																	}
																}
																return { expr : haxe.macro.ExprDef.EIf(cond,e11,e21), pos : haxeparser.HaxeParser.punion(p16,e21 == null?e11.pos:e21.pos)};
															default:
																throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
															}
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 10:
												var p17 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e9 = this.popt($bind(this,this.expr));
												return { expr : haxe.macro.ExprDef.EReturn(e9), pos : e9 == null?p17:haxeparser.HaxeParser.punion(p17,e9.pos)};
											case 8:
												var p18 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return { expr : haxe.macro.ExprDef.EBreak, pos : p18};
											case 9:
												var p19 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												return { expr : haxe.macro.ExprDef.EContinue, pos : p19};
											case 5:
												var p110 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												{
													var _g26 = this.peek(0);
													switch(_g26.tok[1]) {
													case 18:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cond1 = this.expr();
														{
															var _g33 = this.peek(0);
															switch(_g33.tok[1]) {
															case 19:
																this.last = this.token.elt;
																this.token = this.token.next;
																var e10 = this.secureExpr();
																return { expr : haxe.macro.ExprDef.EWhile(cond1,e10,true), pos : haxeparser.HaxeParser.punion(p110,e10.pos)};
															default:
																throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
															}
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 6:
												var p111 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e12 = this.expr();
												{
													var _g27 = this.peek(0);
													switch(_g27.tok[1]) {
													case 0:
														switch(_g27.tok[2][1]) {
														case 5:
															this.last = this.token.elt;
															this.token = this.token.next;
															{
																var _g34 = this.peek(0);
																switch(_g34.tok[1]) {
																case 18:
																	this.last = this.token.elt;
																	this.token = this.token.next;
																	var cond2 = this.expr();
																	{
																		var _g41 = this.peek(0);
																		switch(_g41.tok[1]) {
																		case 19:
																			this.last = this.token.elt;
																			this.token = this.token.next;
																			return { expr : haxe.macro.ExprDef.EWhile(cond2,e12,false), pos : haxeparser.HaxeParser.punion(p111,e12.pos)};
																		default:
																			throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
																		}
																	}
																	break;
																default:
																	throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
																}
															}
															break;
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 14:
												var p112 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e13 = this.expr();
												{
													var _g28 = this.peek(0);
													switch(_g28.tok[1]) {
													case 16:
														this.last = this.token.elt;
														this.token = this.token.next;
														var cases = this.parseSwitchCases(e13,[]);
														{
															var _g35 = this.peek(0);
															switch(_g35.tok[1]) {
															case 17:
																var p24 = _g35.pos;
																this.last = this.token.elt;
																this.token = this.token.next;
																return { expr : haxe.macro.ExprDef.ESwitch(e13,cases.cases,cases.def), pos : haxeparser.HaxeParser.punion(p112,p24)};
															default:
																throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
															}
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
												}
												break;
											case 20:
												var p113 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e14 = this.expr();
												var cl = this.plist($bind(this,this.parseCatch));
												return { expr : haxe.macro.ExprDef.ETry(e14,cl), pos : p113};
											case 29:
												var p114 = _g14.pos;
												this.last = this.token.elt;
												this.token = this.token.next;
												var e15 = this.expr();
												return { expr : haxe.macro.ExprDef.EUntyped(e15), pos : haxeparser.HaxeParser.punion(p114,e15.pos)};
											default:
												throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
											}
											break;
										case 8:
											var p115 = _g14.pos;
											var i1 = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											var e23 = this.expr();
											return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpInterval,{ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(i1)), pos : p115},e23);
										case 3:
											var p20 = _g14.pos;
											var v1 = _g14.tok[2];
											this.last = this.token.elt;
											this.token = this.token.next;
											return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("$" + v1)), pos : p20});
										default:
											throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
										}
									}
								} else throw(_2);
							}
						}
						break;
					case 1:
						var p25 = _g.pos;
						var c = _g.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe.macro.ExprDef.EConst(c), pos : p25});
					case 18:
						var p116 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var e16 = this.expr();
						{
							var _g15 = this.peek(0);
							switch(_g15.tok[1]) {
							case 19:
								var p26 = _g15.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe.macro.ExprDef.EParenthesis(e16), pos : haxeparser.HaxeParser.punion(p116,p26)});
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
						break;
					case 14:
						var p117 = _g.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						var l = this.parseArrayDecl();
						{
							var _g16 = this.peek(0);
							switch(_g16.tok[1]) {
							case 15:
								var p27 = _g16.pos;
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe.macro.ExprDef.EArrayDecl(l), pos : haxeparser.HaxeParser.punion(p117,p27)});
							default:
								throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
							}
						}
						break;
					default:
						try {
							var inl = this.inlineFunction();
							var name = this.popt($bind(this,this.dollarIdent));
							var pl = this.parseConstraintParams();
							{
								var _g13 = this.peek(0);
								switch(_g13.tok[1]) {
								case 18:
									this.last = this.token.elt;
									this.token = this.token.next;
									var al1 = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.parseFunParam));
									{
										var _g22 = this.peek(0);
										switch(_g22.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											var t2 = this.parseTypeOpt();
											var make = function(e4) {
												var f = { params : pl, ret : t2, args : al1, expr : e4};
												return { expr : haxe.macro.ExprDef.EFunction(name == null?null:inl.isInline?"inline_" + name.name:name.name,f), pos : haxeparser.HaxeParser.punion(inl.pos,e4.pos)};
											};
											return this.exprNext(make(this.secureExpr()));
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									break;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
						} catch( _2 ) {
							if( js.Boot.__instanceof(_2,hxparse.NoMatch) ) {
								{
									var _g14 = this.peek(0);
									switch(_g14.tok[1]) {
									case 4:
										var p14 = _g14.pos;
										var op = _g14.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										var e5 = this.expr();
										return haxeparser.HaxeParser.makeUnop(op,e5,p14);
									case 5:
										switch(_g14.tok[2][1]) {
										case 3:
											var p15 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e6 = this.expr();
											var neg = function(s) {
												if(HxOverrides.cca(s,0) == 45) return HxOverrides.substr(s,1,null); else return "-" + s;
											};
											{
												var _g23 = haxeparser.HaxeParser.makeUnop(haxe.macro.Unop.OpNeg,e6,p15);
												var e7 = _g23;
												switch(_g23.expr[1]) {
												case 9:
													switch(_g23.expr[2][1]) {
													case 3:
														switch(_g23.expr[3]) {
														case false:
															switch(_g23.expr[4].expr[1]) {
															case 0:
																switch(_g23.expr[4].expr[2][1]) {
																case 0:
																	var p8 = _g23.pos;
																	var i = _g23.expr[4].expr[2][2];
																	return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(neg(i))), pos : p8};
																case 1:
																	var p9 = _g23.pos;
																	var j = _g23.expr[4].expr[2][2];
																	return { expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(neg(j))), pos : p9};
																default:
																	return e7;
																}
																break;
															default:
																return e7;
															}
															break;
														default:
															return e7;
														}
														break;
													default:
														return e7;
													}
													break;
												default:
													return e7;
												}
											}
											break;
										default:
											throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
										}
										break;
									case 0:
										switch(_g14.tok[2][1]) {
										case 7:
											var p10 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g24 = this.peek(0);
												switch(_g24.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var it = this.expr();
													{
														var _g31 = this.peek(0);
														switch(_g31.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e8 = this.secureExpr();
															return { expr : haxe.macro.ExprDef.EFor(it,e8), pos : haxeparser.HaxeParser.punion(p10,e8.pos)};
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 3:
											var p16 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g25 = this.peek(0);
												switch(_g25.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cond = this.expr();
													{
														var _g32 = this.peek(0);
														switch(_g32.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e11 = this.expr();
															var e21;
															{
																var _g4 = this.peek(0);
																switch(_g4.tok[1]) {
																case 0:
																	switch(_g4.tok[2][1]) {
																	case 4:
																		this.last = this.token.elt;
																		this.token = this.token.next;
																		var e22 = this.expr();
																		e21 = e22;
																		break;
																	default:
																		{
																			var _g5 = this.peek(0);
																			var _g6 = this.peek(1);
																			switch(_g5.tok[1]) {
																			case 9:
																				switch(_g6.tok[1]) {
																				case 0:
																					switch(_g6.tok[2][1]) {
																					case 4:
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						this.last = this.token.elt;
																						this.token = this.token.next;
																						e21 = this.secureExpr();
																						break;
																					default:
																						e21 = null;
																					}
																					break;
																				default:
																					e21 = null;
																				}
																				break;
																			default:
																				e21 = null;
																			}
																		}
																	}
																	break;
																default:
																	{
																		var _g5 = this.peek(0);
																		var _g6 = this.peek(1);
																		switch(_g5.tok[1]) {
																		case 9:
																			switch(_g6.tok[1]) {
																			case 0:
																				switch(_g6.tok[2][1]) {
																				case 4:
																					this.last = this.token.elt;
																					this.token = this.token.next;
																					this.last = this.token.elt;
																					this.token = this.token.next;
																					e21 = this.secureExpr();
																					break;
																				default:
																					e21 = null;
																				}
																				break;
																			default:
																				e21 = null;
																			}
																			break;
																		default:
																			e21 = null;
																		}
																	}
																}
															}
															return { expr : haxe.macro.ExprDef.EIf(cond,e11,e21), pos : haxeparser.HaxeParser.punion(p16,e21 == null?e11.pos:e21.pos)};
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 10:
											var p17 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e9 = this.popt($bind(this,this.expr));
											return { expr : haxe.macro.ExprDef.EReturn(e9), pos : e9 == null?p17:haxeparser.HaxeParser.punion(p17,e9.pos)};
										case 8:
											var p18 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return { expr : haxe.macro.ExprDef.EBreak, pos : p18};
										case 9:
											var p19 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											return { expr : haxe.macro.ExprDef.EContinue, pos : p19};
										case 5:
											var p110 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g26 = this.peek(0);
												switch(_g26.tok[1]) {
												case 18:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cond1 = this.expr();
													{
														var _g33 = this.peek(0);
														switch(_g33.tok[1]) {
														case 19:
															this.last = this.token.elt;
															this.token = this.token.next;
															var e10 = this.secureExpr();
															return { expr : haxe.macro.ExprDef.EWhile(cond1,e10,true), pos : haxeparser.HaxeParser.punion(p110,e10.pos)};
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 6:
											var p111 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e12 = this.expr();
											{
												var _g27 = this.peek(0);
												switch(_g27.tok[1]) {
												case 0:
													switch(_g27.tok[2][1]) {
													case 5:
														this.last = this.token.elt;
														this.token = this.token.next;
														{
															var _g34 = this.peek(0);
															switch(_g34.tok[1]) {
															case 18:
																this.last = this.token.elt;
																this.token = this.token.next;
																var cond2 = this.expr();
																{
																	var _g41 = this.peek(0);
																	switch(_g41.tok[1]) {
																	case 19:
																		this.last = this.token.elt;
																		this.token = this.token.next;
																		return { expr : haxe.macro.ExprDef.EWhile(cond2,e12,false), pos : haxeparser.HaxeParser.punion(p111,e12.pos)};
																	default:
																		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
																	}
																}
																break;
															default:
																throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
															}
														}
														break;
													default:
														throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 14:
											var p112 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e13 = this.expr();
											{
												var _g28 = this.peek(0);
												switch(_g28.tok[1]) {
												case 16:
													this.last = this.token.elt;
													this.token = this.token.next;
													var cases = this.parseSwitchCases(e13,[]);
													{
														var _g35 = this.peek(0);
														switch(_g35.tok[1]) {
														case 17:
															var p24 = _g35.pos;
															this.last = this.token.elt;
															this.token = this.token.next;
															return { expr : haxe.macro.ExprDef.ESwitch(e13,cases.cases,cases.def), pos : haxeparser.HaxeParser.punion(p112,p24)};
														default:
															throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
														}
													}
													break;
												default:
													throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
												}
											}
											break;
										case 20:
											var p113 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e14 = this.expr();
											var cl = this.plist($bind(this,this.parseCatch));
											return { expr : haxe.macro.ExprDef.ETry(e14,cl), pos : p113};
										case 29:
											var p114 = _g14.pos;
											this.last = this.token.elt;
											this.token = this.token.next;
											var e15 = this.expr();
											return { expr : haxe.macro.ExprDef.EUntyped(e15), pos : haxeparser.HaxeParser.punion(p114,e15.pos)};
										default:
											throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
										}
										break;
									case 8:
										var p115 = _g14.pos;
										var i1 = _g14.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										var e23 = this.expr();
										return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpInterval,{ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CInt(i1)), pos : p115},e23);
									case 3:
										var p20 = _g14.pos;
										var v1 = _g14.tok[2];
										this.last = this.token.elt;
										this.token = this.token.next;
										return this.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CIdent("$" + v1)), pos : p20});
									default:
										throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
									}
								}
							} else throw(_2);
						}
					}
				}
			} else throw(_);
		}
	}
	,toplevelExpr: function() {
		return this.expr();
	}
	,exprNext: function(e1) {
		var _g2 = this;
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 10:
				var p = _g.pos;
				this.last = this.token.elt;
				this.token = this.token.next;
				{
					var _g1 = this.peek(0);
					switch(_g1.tok[1]) {
					case 3:
						var p2 = _g1.pos;
						var v = _g1.tok[2];
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe.macro.ExprDef.EField(e1,"$" + v), pos : haxeparser.HaxeParser.punion(e1.pos,p2)});
					default:
						var def = function() {
							var def1 = function() {
								switch(e1.expr[1]) {
								case 0:
									switch(e1.expr[2][1]) {
									case 0:
										var p21 = e1.pos;
										var v1 = e1.expr[2][2];
										if(p21.max == p.min) return _g2.exprNext({ expr : haxe.macro.ExprDef.EConst(haxe.macro.Constant.CFloat(v1 + ".")), pos : haxeparser.HaxeParser.punion(p,p21)}); else throw new hxparse.Unexpected(_g2.peek(0),_g2.stream.curPos());
										break;
									default:
										throw new hxparse.Unexpected(_g2.peek(0),_g2.stream.curPos());
									}
									break;
								default:
									throw new hxparse.Unexpected(_g2.peek(0),_g2.stream.curPos());
								}
							};
							{
								var _g3 = _g2.peek(0);
								switch(_g3.tok[1]) {
								case 0:
									switch(_g3.tok[2][1]) {
									case 41:
										var p22 = _g3.pos;
										if(p.max == p22.min) {
											_g2.last = _g2.token.elt;
											_g2.token = _g2.token.next;
											return _g2.exprNext({ expr : haxe.macro.ExprDef.EField(e1,"macro"), pos : haxeparser.HaxeParser.punion(e1.pos,p22)});
										} else return def1();
										break;
									default:
										return def1();
									}
									break;
								default:
									return def1();
								}
							}
						};
						{
							var _g21 = this.peek(0);
							switch(_g21.tok[1]) {
							case 1:
								switch(_g21.tok[2][1]) {
								case 3:
									var p23 = _g21.pos;
									var f = _g21.tok[2][2];
									if(p.max == p23.min) {
										this.last = this.token.elt;
										this.token = this.token.next;
										return this.exprNext({ expr : haxe.macro.ExprDef.EField(e1,f), pos : haxeparser.HaxeParser.punion(e1.pos,p23)});
									} else return def();
									break;
								default:
									return def();
								}
								break;
							default:
								return def();
							}
						}
					}
				}
				break;
			case 18:
				this.last = this.token.elt;
				this.token = this.token.next;
				try {
					var params = this.parseCallParams();
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 19:
							var p24 = _g11.pos;
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.ECall(e1,params), pos : haxeparser.HaxeParser.punion(e1.pos,p24)});
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
				} catch( _ ) {
					if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					} else throw(_);
				}
				break;
			case 14:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e2 = this.expr();
				{
					var _g12 = this.peek(0);
					switch(_g12.tok[1]) {
					case 15:
						var p25 = _g12.pos;
						this.last = this.token.elt;
						this.token = this.token.next;
						return this.exprNext({ expr : haxe.macro.ExprDef.EArray(e1,e2), pos : haxeparser.HaxeParser.punion(e1.pos,p25)});
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 5:
				var op = _g.tok[2];
				switch(_g.tok[2][1]) {
				case 7:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g13 = this.peek(0);
						switch(_g13.tok[1]) {
						case 5:
							switch(_g13.tok[2][1]) {
							case 7:
								this.last = this.token.elt;
								this.token = this.token.next;
								{
									var _g22 = this.peek(0);
									switch(_g22.tok[1]) {
									case 5:
										switch(_g22.tok[2][1]) {
										case 7:
											this.last = this.token.elt;
											this.token = this.token.next;
											{
												var _g31 = this.peek(0);
												switch(_g31.tok[1]) {
												case 5:
													switch(_g31.tok[2][1]) {
													case 4:
														this.last = this.token.elt;
														this.token = this.token.next;
														var e21 = this.expr();
														return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpUShr),e1,e21);
													default:
														var e22 = this.secureExpr();
														return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpUShr,e1,e22);
													}
													break;
												default:
													var e22 = this.secureExpr();
													return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpUShr,e1,e22);
												}
											}
											break;
										case 4:
											this.last = this.token.elt;
											this.token = this.token.next;
											var e23 = this.expr();
											return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpShr),e1,e23);
										default:
											var e24 = this.secureExpr();
											return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpShr,e1,e24);
										}
										break;
									default:
										var e24 = this.secureExpr();
										return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpShr,e1,e24);
									}
								}
								break;
							case 4:
								this.last = this.token.elt;
								this.token = this.token.next;
								return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpGte,e1,this.secureExpr());
							default:
								var e25 = this.secureExpr();
								return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpGt,e1,e25);
							}
							break;
						default:
							var e25 = this.secureExpr();
							return haxeparser.HaxeParser.makeBinop(haxe.macro.Binop.OpGt,e1,e25);
						}
					}
					break;
				default:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e26 = this.expr();
					return haxeparser.HaxeParser.makeBinop(op,e1,e26);
				}
				break;
			case 20:
				this.last = this.token.elt;
				this.token = this.token.next;
				var e27 = this.expr();
				{
					var _g14 = this.peek(0);
					switch(_g14.tok[1]) {
					case 11:
						this.last = this.token.elt;
						this.token = this.token.next;
						var e3 = this.expr();
						return { expr : haxe.macro.ExprDef.ETernary(e1,e27,e3), pos : haxeparser.HaxeParser.punion(e1.pos,e3.pos)};
					default:
						throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
					}
				}
				break;
			case 0:
				switch(_g.tok[2][1]) {
				case 27:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e28 = this.expr();
					return { expr : haxe.macro.ExprDef.EIn(e1,e28), pos : haxeparser.HaxeParser.punion(e1.pos,e28.pos)};
				default:
					var def2 = function() {
						var def3 = function() {
							return e1;
						};
						{
							var _g15 = _g2.peek(0);
							switch(_g15.tok[1]) {
							case 16:
								var p1 = _g15.pos;
								if(haxeparser.HaxeParser.isDollarIdent(e1)) {
									_g2.last = _g2.token.elt;
									_g2.token = _g2.token.next;
									var eparam = _g2.expr();
									{
										var _g32 = _g2.peek(0);
										switch(_g32.tok[1]) {
										case 17:
											var p26 = _g32.pos;
											_g2.last = _g2.token.elt;
											_g2.token = _g2.token.next;
											{
												var _g4 = e1.expr;
												switch(_g4[1]) {
												case 0:
													switch(_g4[2][1]) {
													case 3:
														var n = _g4[2][2];
														return _g2.exprNext({ expr : haxe.macro.ExprDef.EMeta({ name : n, params : [], pos : e1.pos},eparam), pos : haxeparser.HaxeParser.punion(p1,p26)});
													default:
														throw false;
													}
													break;
												default:
													throw false;
												}
											}
											break;
										default:
											throw new hxparse.Unexpected(_g2.peek(0),_g2.stream.curPos());
										}
									}
								} else return def3();
								break;
							default:
								return def3();
							}
						}
					};
					{
						var _g16 = this.peek(0);
						switch(_g16.tok[1]) {
						case 4:
							var p3 = _g16.pos;
							var op1 = _g16.tok[2];
							if(haxeparser.HaxeParser.isPostfix(e1,op1)) {
								this.last = this.token.elt;
								this.token = this.token.next;
								return this.exprNext({ expr : haxe.macro.ExprDef.EUnop(op1,true,e1), pos : haxeparser.HaxeParser.punion(e1.pos,p3)});
							} else return def2();
							break;
						default:
							return def2();
						}
					}
				}
				break;
			default:
				var def2 = function() {
					var def3 = function() {
						return e1;
					};
					{
						var _g15 = _g2.peek(0);
						switch(_g15.tok[1]) {
						case 16:
							var p1 = _g15.pos;
							if(haxeparser.HaxeParser.isDollarIdent(e1)) {
								_g2.last = _g2.token.elt;
								_g2.token = _g2.token.next;
								var eparam = _g2.expr();
								{
									var _g32 = _g2.peek(0);
									switch(_g32.tok[1]) {
									case 17:
										var p26 = _g32.pos;
										_g2.last = _g2.token.elt;
										_g2.token = _g2.token.next;
										{
											var _g4 = e1.expr;
											switch(_g4[1]) {
											case 0:
												switch(_g4[2][1]) {
												case 3:
													var n = _g4[2][2];
													return _g2.exprNext({ expr : haxe.macro.ExprDef.EMeta({ name : n, params : [], pos : e1.pos},eparam), pos : haxeparser.HaxeParser.punion(p1,p26)});
												default:
													throw false;
												}
												break;
											default:
												throw false;
											}
										}
										break;
									default:
										throw new hxparse.Unexpected(_g2.peek(0),_g2.stream.curPos());
									}
								}
							} else return def3();
							break;
						default:
							return def3();
						}
					}
				};
				{
					var _g16 = this.peek(0);
					switch(_g16.tok[1]) {
					case 4:
						var p3 = _g16.pos;
						var op1 = _g16.tok[2];
						if(haxeparser.HaxeParser.isPostfix(e1,op1)) {
							this.last = this.token.elt;
							this.token = this.token.next;
							return this.exprNext({ expr : haxe.macro.ExprDef.EUnop(op1,true,e1), pos : haxeparser.HaxeParser.punion(e1.pos,p3)});
						} else return def2();
						break;
					default:
						return def2();
					}
				}
			}
		}
	}
	,parseGuard: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 3:
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var e = this.expr();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 19:
									this.last = this.token.elt;
									this.token = this.token.next;
									return e;
								default:
									throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseSwitchCases: function(eswitch,cases) {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 16:
					var p1 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 11:
							this.last = this.token.elt;
							this.token = this.token.next;
							var b = this.block([]);
							var b1 = { expr : b.length == 0?null:haxe.macro.ExprDef.EBlock(b), pos : p1};
							var cl = this.parseSwitchCases(eswitch,cases);
							if(cl.def != null) throw { msg : haxeparser.ParserErrorMsg.DuplicateDefault, pos : p1};
							return { cases : cl.cases, def : b1};
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				case 15:
					var p11 = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					var el = this.psep(haxeparser.TokenDef.Comma,$bind(this,this.expr));
					var eg = this.popt($bind(this,this.parseGuard));
					{
						var _g11 = this.peek(0);
						switch(_g11.tok[1]) {
						case 11:
							this.last = this.token.elt;
							this.token = this.token.next;
							var b2 = this.block([]);
							var b3;
							if(b2.length == 0) b3 = { expr : haxe.macro.ExprDef.EBlock(b2), pos : p11}; else b3 = null;
							return this.parseSwitchCases(eswitch,haxeparser.HaxeParser.aadd(cases,{ values : el, guard : eg, expr : b3}));
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					cases.reverse();
					return { cases : cases, def : null};
				}
				break;
			default:
				cases.reverse();
				return { cases : cases, def : null};
			}
		}
	}
	,parseCatch: function() {
		{
			var _g = this.peek(0);
			switch(_g.tok[1]) {
			case 0:
				switch(_g.tok[2][1]) {
				case 21:
					var p = _g.pos;
					this.last = this.token.elt;
					this.token = this.token.next;
					{
						var _g1 = this.peek(0);
						switch(_g1.tok[1]) {
						case 18:
							this.last = this.token.elt;
							this.token = this.token.next;
							var id = this.ident();
							{
								var _g2 = this.peek(0);
								switch(_g2.tok[1]) {
								case 11:
									this.last = this.token.elt;
									this.token = this.token.next;
									var t = this.parseComplexType();
									{
										var _g3 = this.peek(0);
										switch(_g3.tok[1]) {
										case 19:
											this.last = this.token.elt;
											this.token = this.token.next;
											return { name : id.name, type : t, expr : this.secureExpr()};
										default:
											throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
										}
									}
									break;
								default:
									throw { msg : haxeparser.ParserErrorMsg.MissingType, pos : p};
								}
							}
							break;
						default:
							throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
						}
					}
					break;
				default:
					throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
				}
				break;
			default:
				throw new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
			}
		}
	}
	,parseCallParams: function() {
		var ret = [];
		try {
			var e = this.expr();
			ret.push(e);
		} catch( _ ) {
			if( js.Boot.__instanceof(_,hxparse.NoMatch) ) {
				return [];
			} else throw(_);
		}
		try {
			while(true) {
				var _g = this.peek(0);
				switch(_g.tok[1]) {
				case 13:
					this.last = this.token.elt;
					this.token = this.token.next;
					var e1 = this.expr();
					ret.push(e1);
					break;
				default:
					throw "__break__";
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return ret;
	}
	,secureExpr: function() {
		return this.expr();
	}
	,__class__: haxeparser.HaxeParser
});
var haxeprinter = {};
haxeprinter.Printer = function() {
	this.config = JSON.parse(haxe.Resource.getString("config"));
};
haxeprinter.Printer.__name__ = true;
haxeprinter.Printer.prototype = {
	setIndent: function(level) {
		this.indentLevel = level;
		if(this.config.indent_with_tabs) this.indent = StringTools.lpad("","\t",this.indentLevel); else this.indent = StringTools.lpad(""," ",this.indentLevel * this.config.tab_width | 0);
	}
	,newline: function() {
		this.buf.b += this.line.b + "\n";
		this.line = new StringBuf();
		this.col = 0;
		this.lineLen = 0;
	}
	,print: function(s,style) {
		if(style == null) style = haxeprinter.Style.SNormal;
		this.lineLen += s.length;
		var style1 = ((function($this) {
			var $r;
			var _this = Std.string(style);
			$r = HxOverrides.substr(_this,1,null);
			return $r;
		}(this))).toLowerCase();
		this.line.b += "<span class=\"" + style1 + "\">" + s + "</span>";
	}
	,breakPoint: function(force) {
		if(force == null) force = false;
		if(this.col > 0 && (force || this.col + this.lineLen > this.config.maximum_line_length)) {
			this.buf.b += "\n";
			this.setIndent(this.indentLevel + 1);
			this.buf.b += this.indent;
			this.col = this.indent.length;
			this.setIndent(this.indentLevel - 1);
		}
		this.col += this.lineLen;
		this.buf.b += this.line.b;
		this.line = new StringBuf();
		this.lineLen = 0;
	}
	,printAST: function(ast) {
		this.indentLevel = 0;
		this.indent = "";
		this.col = 0;
		this.buf = new StringBuf();
		this.line = new StringBuf();
		this.lineLen = 0;
		this.printPackage(ast.pack);
		var _g = 0;
		var _g1 = ast.decls;
		while(_g < _g1.length) {
			var type = _g1[_g];
			++_g;
			this.printType(type);
		}
		return this.buf.b;
	}
	,printPackage: function(pack) {
		if(pack.length == 0 && !this.config.print_root_package) return;
		this.print("package",haxeprinter.Style.SDirective);
		var _g1 = 0;
		var _g = pack.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) this.print(" ");
			this.print(pack[i],haxeprinter.Style.SType);
			if(i < pack.length - 1) this.print(".");
		}
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_package) this.newline();
	}
	,printType: function(type) {
		switch(type[1]) {
		case 3:
			var mode = type[3];
			var sl = type[2];
			this.printImport(sl,mode);
			break;
		case 5:
			var path = type[2];
			this.printUsing(path);
			break;
		case 2:
			var data = type[2];
			this.printAbstract(data);
			break;
		case 0:
			var data1 = type[2];
			this.printClass(data1);
			break;
		case 1:
			var data2 = type[2];
			this.printEnum(data2);
			break;
		case 4:
			var data3 = type[2];
			this.printTypedef(data3);
			break;
		}
	}
	,printImport: function(path,mode) {
		this.print("import",haxeprinter.Style.SDirective);
		var _g1 = 0;
		var _g = path.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(i == 0) this.print(" ");
			this.print(path[i].pack,haxeprinter.Style.SType);
			if(i < path.length - 1) this.print(".");
		}
		{
			var o = mode;
			switch(mode[1]) {
			case 2:
				this.print(".");
				this.print("*",haxeprinter.Style.SOperator);
				break;
			case 1:
				var s = mode[2];
				this.print(" ");
				this.print("in",haxeprinter.Style.SKeyword);
				this.print(" ");
				this.print(s);
				break;
			default:
			}
		}
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_import) this.newline();
	}
	,printUsing: function(path) {
		this.print("using",haxeprinter.Style.SDirective);
		this.print(" ");
		this.printTypePath(path);
		this.print(";");
		this.newline();
		if(this.config.empty_line_after_import) this.newline();
	}
	,printAbstract: function(data) {
		console.log(data);
	}
	,printClass: function(type) {
		if(this.buf.b.length > 0 && this.config.empty_line_before_type) this.newline();
		var isInterface = false;
		var modifiers = [];
		var ext = null;
		var impls = [];
		var _g = 0;
		var _g1 = type.flags;
		while(_g < _g1.length) {
			var flag = _g1[_g];
			++_g;
			switch(flag[1]) {
			case 0:
				isInterface = true;
				break;
			case 1:
				modifiers.push("extern");
				break;
			case 2:
				modifiers.push("private");
				break;
			case 3:
				var t = flag[2];
				ext = t;
				break;
			case 4:
				var t1 = flag[2];
				impls.push(t1);
				break;
			}
		}
		this.printModifiers(modifiers);
		this.print(isInterface?"interface":"class",haxeprinter.Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter.Style.SType);
		this.printTypeParamDecls(type.params);
		if(ext != null) {
			this.print(" ");
			this.breakPoint();
			this.print("extends",haxeprinter.Style.SKeyword);
			this.print(" ");
			this.printTypePath(ext);
			this.breakPoint(this.config.extends_on_newline);
		}
		if(impls.length > 0) {
			var _g2 = 0;
			while(_g2 < impls.length) {
				var impl = impls[_g2];
				++_g2;
				this.print(" ");
				this.breakPoint();
				this.print("implements",haxeprinter.Style.SKeyword);
				this.print(" ");
				this.printTypePath(impl);
				this.breakPoint(this.config.implements_on_newline);
			}
		}
		if(type.data.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			this.newline();
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
			this.breakPoint();
		} else {
			this.breakPoint();
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g11 = 0;
		var _g3 = type.data.length;
		while(_g11 < _g3) {
			var i = _g11++;
			this.printClassField(type.data[i]);
			if(i < type.data.length - 1 && this.config.empty_line_between_fields) this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
		this.newline();
	}
	,printClassField: function(field) {
		this.print(this.indent);
		var modifiers = field.access.map(function(a) {
			return ((function($this) {
				var $r;
				var _this = Std.string(a);
				$r = HxOverrides.substr(_this,1,null);
				return $r;
			}(this))).toLowerCase();
		});
		if(this.config.remove_private_field_modifier) HxOverrides.remove(modifiers,"private");
		this.printModifiers(modifiers);
		{
			var _g = field.kind;
			switch(_g[1]) {
			case 1:
				var f = _g[2];
				this.printFunction(field,f);
				break;
			case 0:
				var e = _g[3];
				var t = _g[2];
				this.printProp(field,null,null,t,e);
				break;
			case 2:
				var e1 = _g[5];
				var t1 = _g[4];
				var set = _g[3];
				var get = _g[2];
				this.printProp(field,get,set,t1,e1);
				break;
			}
		}
	}
	,printEnum: function(type) {
		if(this.config.empty_line_before_type) this.newline();
		var modifiers = type.flags.map(function(flag) {
			return ((function($this) {
				var $r;
				var _this = Std.string(flag);
				$r = HxOverrides.substr(_this,1,null);
				return $r;
			}(this))).toLowerCase();
		});
		this.printModifiers(modifiers);
		this.print("enum",haxeprinter.Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter.Style.SType);
		this.printTypeParamDecls(type.params);
		if(type.data.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			this.newline();
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
		} else {
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g1 = 0;
		var _g = type.data.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printEnumConstructor(type.data[i]);
			if(i < type.data.length - 1 && this.config.empty_line_between_enum_constructors) this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
		this.newline();
	}
	,printEnumConstructor: function(ctor) {
		this.print(this.indent);
		this.print(ctor.name,haxeprinter.Style.SType);
		this.printTypeParamDecls(ctor.params);
		this.printEnumConstructorArgs(ctor.args);
		this.print(";");
		this.newline();
	}
	,printEnumConstructorArgs: function(args) {
		if(args.length == 0) return;
		this.print("(");
		var _g1 = 0;
		var _g = args.length;
		while(_g1 < _g) {
			var i = _g1++;
			var arg = args[i];
			if(arg.opt) this.print("?");
			this.print(arg.name,haxeprinter.Style.SIdent);
			this.print(":");
			this.printComplexType(arg.type);
			if(i < args.length - 1) {
				if(this.config.space_between_enum_constructor_args) this.print(", "); else this.print(",");
			}
		}
		this.print(")");
	}
	,printTypedef: function(type) {
		if(this.config.empty_line_before_type) this.newline();
		var modifiers = type.flags.map(function(flag) {
			return ((function($this) {
				var $r;
				var _this = Std.string(flag);
				$r = HxOverrides.substr(_this,1,null);
				return $r;
			}(this))).toLowerCase();
		});
		this.printModifiers(modifiers);
		this.print("typedef",haxeprinter.Style.SDirective);
		this.print(" ");
		this.print(type.name,haxeprinter.Style.SType);
		this.printTypeParamDecls(type.params);
		this.print(" = ");
		{
			var _g = type.data;
			switch(_g[1]) {
			case 2:
				var fields = _g[2];
				this.printAnonFields(fields);
				break;
			case 0:
				var path = _g[2];
				this.printTypePath(path);
				break;
			default:
				throw "todo: " + Std.string(type.data);
			}
		}
		this.newline();
	}
	,printAnonFields: function(fields) {
		if(fields.length == 0 && this.config.inline_empty_braces) {
			this.print(" {}");
			return;
		}
		if(this.config.cuddle_type_braces) {
			this.print(" {");
			this.newline();
		} else {
			this.newline();
			this.print("{");
			this.newline();
		}
		this.setIndent(this.indentLevel + 1);
		var _g1 = 0;
		var _g = fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var field = fields[i];
			this.print(this.indent);
			this.print(field.name,haxeprinter.Style.SIdent);
			this.print(":");
			{
				var _g2 = field.kind;
				switch(_g2[1]) {
				case 0:
					var t = _g2[2];
					this.printComplexType(t);
					break;
				default:
					throw "todo: " + Std.string(field.kind);
				}
			}
			if(i < fields.length - 1) {
				this.print(",");
				if(this.config.empty_line_between_typedef_fields) this.newline();
			}
			this.newline();
		}
		this.setIndent(this.indentLevel - 1);
		this.print("}");
	}
	,printFunction: function(field,f) {
		this.print("function",haxeprinter.Style.SKeyword);
		this.print(" ");
		this.print(field.name,haxeprinter.Style.SIdent);
		this.printTypeParamDecls(f.params);
		this.printFunctionArgs(f.args);
		if(f.ret != null) {
			this.print(":");
			this.printComplexType(f.ret);
		}
		if(this.config.cuddle_method_braces) this.print(" "); else {
			this.newline();
			this.print(this.indent);
		}
		this.printExpr(f.expr);
		this.newline();
	}
	,printProp: function(field,get,set,type,expr) {
		this.print("var",haxeprinter.Style.SKeyword);
		this.print(" ");
		this.print(field.name,haxeprinter.Style.SIdent);
		if(get != null && set != null) {
			this.print("(");
			this.print(get,haxeprinter.Style.SModifier);
			if(this.config.space_betwen_property_get_set) this.print(", "); else this.print(",");
			this.print(set,haxeprinter.Style.SModifier);
			this.print(")");
		}
		if(type != null) {
			this.print(":");
			this.printComplexType(type);
		}
		if(expr != null) {
			if(this.config.space_around_property_assign) this.print(" = "); else this.print("=");
			this.printExpr(expr);
		}
		this.print(";");
		this.newline();
	}
	,printExpr: function(expr) {
		this.print(haxe.macro.ExprTools.toString(expr).split("\n").join("\n" + this.indent));
	}
	,printFunctionArgs: function(args) {
		this.print("(");
		this.breakPoint(this.config.function_arg_on_newline);
		var _g1 = 0;
		var _g = args.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.breakPoint(this.config.function_arg_on_newline);
			var arg = args[i];
			if(arg.opt) this.print("?");
			this.print(arg.name,haxeprinter.Style.SIdent);
			if(arg.type != null) {
				this.print(":");
				this.printComplexType(arg.type);
			}
			if(arg.value != null) {
				if(this.config.space_around_function_arg_assign) this.print(" = "); else this.print("=");
				this.printExpr(arg.value);
			}
			if(i < args.length - 1) {
				this.print(",");
				if(this.config.space_between_function_args) this.print(" ");
				this.breakPoint();
			}
		}
		this.print(")");
		this.breakPoint();
	}
	,printModifiers: function(modifiers) {
		if(modifiers.length == 0) return;
		var order = this.config.modifier_order;
		modifiers.sort(function(a,b) {
			return HxOverrides.indexOf(order,a,0) - HxOverrides.indexOf(order,b,0);
		});
		var _g = 0;
		while(_g < modifiers.length) {
			var modifier = modifiers[_g];
			++_g;
			this.print(modifier,haxeprinter.Style.SModifier);
			this.print(" ");
		}
	}
	,printTypePath: function(path) {
		var pack = path.pack.concat([path.name]);
		var _g1 = 0;
		var _g = pack.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.print(pack[i],haxeprinter.Style.SType);
			if(i < pack.length - 1) this.print(".");
		}
		var params = path.params;
		if(params.length == 0) return;
		this.print("<");
		var _g11 = 0;
		var _g2 = params.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this.printTypeParam(params[i1]);
			if(i1 < params.length - 1) {
				if(this.config.space_between_type_params) this.print(", "); else this.print(",");
			}
		}
		this.print(">");
	}
	,printTypeParamDecls: function(params) {
		if(params.length == 0) return;
		this.print("<");
		var _g1 = 0;
		var _g = params.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printTypeParamDecl(params[i]);
			if(i < params.length - 1) {
				if(this.config.space_between_type_params) this.print(", "); else this.print(",");
			}
		}
		this.print(">");
	}
	,printTypeParamDecl: function(param) {
		this.print(param.name,haxeprinter.Style.SType);
		var constraints = param.constraints;
		if(constraints.length == 0) return;
		this.print(":");
		if(constraints.length > 1) this.print("(");
		var _g1 = 0;
		var _g = constraints.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.printComplexType(constraints[i]);
			if(i < constraints.length - 1) {
				if(this.config.space_between_type_param_constraints) this.print(", "); else this.print(",");
			}
		}
		if(constraints.length > 1) this.print(")");
	}
	,printTypeParam: function(param) {
		switch(param[1]) {
		case 0:
			var type = param[2];
			this.printComplexType(type);
			break;
		default:
			throw "todo: " + Std.string(param);
		}
	}
	,printComplexType: function(type) {
		switch(type[1]) {
		case 0:
			var path = type[2];
			this.printTypePath(path);
			break;
		case 2:
			var fields = type[2];
			this.printAnonType(fields);
			break;
		default:
			throw "todo: " + Std.string(type);
		}
	}
	,printAnonType: function(fields) {
		this.print("{");
		var _g1 = 0;
		var _g = fields.length;
		while(_g1 < _g) {
			var i = _g1++;
			var field = fields[i];
			this.print(field.name,haxeprinter.Style.SIdent);
			this.print(":");
			{
				var _g2 = field.kind;
				switch(_g2[1]) {
				case 0:
					var t = _g2[2];
					this.printComplexType(t);
					break;
				default:
					throw "todo: " + Std.string(field.kind);
				}
			}
			if(i < fields.length - 1) {
				if(this.config.space_between_anon_type_fields) this.print(", "); else this.print(",");
			}
		}
		this.print("}");
	}
	,__class__: haxeprinter.Printer
};
haxeprinter.Demo = function() { };
haxeprinter.Demo.__name__ = true;
haxeprinter.Demo.main = function() {
	var input = window.document.getElementById("input");
	var output = window.document.getElementById("output");
	var config = window.document.getElementById("config");
	var html = "<form>";
	var _g = 0;
	var _g1 = Reflect.fields(haxeprinter.Demo.printer.config);
	while(_g < _g1.length) {
		var field = _g1[_g];
		++_g;
		var label = field.split("_").join(" ");
		var value = Reflect.field(haxeprinter.Demo.printer.config,field);
		if(value == true || value == false) {
			var checked;
			if(value) checked = " checked"; else checked = "";
			html += "<fieldset><input type=\"checkbox\" name=\"" + field + "\"" + checked + "/></input<label for=\"" + field + "\">" + label + "</label></fieldset>";
		}
	}
	config.innerHTML = html + "</form>";
	config.onclick = function(e) {
		if(e.target.tagName != "INPUT") return;
		var name = e.target.getAttribute("name");
		var value1 = e.target.checked;
		haxeprinter.Demo.printer.config[name] = value1;
		haxeprinter.Demo.update();
	};
	input.oninput = function(e1) {
		haxeprinter.Demo.update();
	};
	input.innerText = haxe.Resource.getString("source");
	haxeprinter.Demo.update();
};
haxeprinter.Demo.update = function() {
	var input = window.document.getElementById("input");
	var output = window.document.getElementById("output");
	output.innerHTML = haxeprinter.Demo.format(input.innerText);
};
haxeprinter.Demo.format = function(source) {
	var input = byte.js._ByteData.ByteData_Impl_.ofString(source);
	var parser = new haxeparser.HaxeParser(input,"foo/bar/TestSource.hx");
	var ast;
	try {
		ast = parser.parse();
	} catch( $e0 ) {
		if( js.Boot.__instanceof($e0,hxparse.NoMatch) ) {
			var e = $e0;
			return "<span class=\"error\">" + e.pos.format(input) + ": Unexpected " + Std.string(e.token.tok) + "</span>";
		} else if( js.Boot.__instanceof($e0,hxparse.Unexpected) ) {
			var e1 = $e0;
			return "<span class=\"error\">" + e1.pos.format(input) + ": Unexpected " + Std.string(e1.token.tok) + "</span>";
		} else {
		var e2 = $e0;
		return "<span class=\"error\">unknown error</span>";
		}
	}
	return haxeprinter.Demo.printer.printAST(ast);
};
haxeprinter.Style = { __ename__ : true, __constructs__ : ["SNormal","SDirective","SOperator","SKeyword","SIdent","SString","SNumber","SType","SModifier"] };
haxeprinter.Style.SNormal = ["SNormal",0];
haxeprinter.Style.SNormal.toString = $estr;
haxeprinter.Style.SNormal.__enum__ = haxeprinter.Style;
haxeprinter.Style.SDirective = ["SDirective",1];
haxeprinter.Style.SDirective.toString = $estr;
haxeprinter.Style.SDirective.__enum__ = haxeprinter.Style;
haxeprinter.Style.SOperator = ["SOperator",2];
haxeprinter.Style.SOperator.toString = $estr;
haxeprinter.Style.SOperator.__enum__ = haxeprinter.Style;
haxeprinter.Style.SKeyword = ["SKeyword",3];
haxeprinter.Style.SKeyword.toString = $estr;
haxeprinter.Style.SKeyword.__enum__ = haxeprinter.Style;
haxeprinter.Style.SIdent = ["SIdent",4];
haxeprinter.Style.SIdent.toString = $estr;
haxeprinter.Style.SIdent.__enum__ = haxeprinter.Style;
haxeprinter.Style.SString = ["SString",5];
haxeprinter.Style.SString.toString = $estr;
haxeprinter.Style.SString.__enum__ = haxeprinter.Style;
haxeprinter.Style.SNumber = ["SNumber",6];
haxeprinter.Style.SNumber.toString = $estr;
haxeprinter.Style.SNumber.__enum__ = haxeprinter.Style;
haxeprinter.Style.SType = ["SType",7];
haxeprinter.Style.SType.toString = $estr;
haxeprinter.Style.SType.__enum__ = haxeprinter.Style;
haxeprinter.Style.SModifier = ["SModifier",8];
haxeprinter.Style.SModifier.toString = $estr;
haxeprinter.Style.SModifier.__enum__ = haxeprinter.Style;
hxparse._LexEngine.Transition = function(chars) {
	this.chars = chars;
};
hxparse._LexEngine.Transition.__name__ = true;
hxparse._LexEngine.Transition.prototype = {
	toString: function() {
		return Std.string(this.chars);
	}
	,__class__: hxparse._LexEngine.Transition
};
hxparse.NoMatch = function(pos,token) {
	this.pos = pos;
	this.token = token;
};
hxparse.NoMatch.__name__ = true;
hxparse.NoMatch.prototype = {
	toString: function() {
		return "" + Std.string(this.pos) + ": No match: " + Std.string(this.token);
	}
	,__class__: hxparse.NoMatch
};
hxparse.Parser = function(stream,ruleset) {
	this.stream = stream;
	this.ruleset = ruleset;
};
hxparse.Parser.__name__ = true;
hxparse.Parser.prototype = {
	peek: function(n) {
		if(this.token == null) {
			this.token = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			n--;
		}
		var tok = this.token;
		while(n > 0) {
			if(tok.next == null) tok.next = new haxe.ds.GenericCell(this.stream.token(this.ruleset),null);
			tok = tok.next;
			n--;
		}
		return tok.elt;
	}
	,junk: function() {
		this.last = this.token.elt;
		this.token = this.token.next;
	}
	,curPos: function() {
		return this.stream.curPos();
	}
	,noMatch: function() {
		return new hxparse.NoMatch(this.stream.curPos(),this.peek(0));
	}
	,unexpected: function() {
		throw new hxparse.Unexpected(this.peek(0),this.stream.curPos());
	}
	,__class__: hxparse.Parser
};
hxparse.RuleBuilderImpl = function() { };
hxparse.RuleBuilderImpl.__name__ = true;
hxparse.State = function() {
	this.final = -1;
	var this1;
	this1 = new Array(256);
	this.trans = this1;
};
hxparse.State.__name__ = true;
hxparse.State.prototype = {
	__class__: hxparse.State
};
hxparse.Unexpected = function(token,pos) {
	this.token = token;
	this.pos = pos;
};
hxparse.Unexpected.__name__ = true;
hxparse.Unexpected.prototype = {
	toString: function() {
		return "Unexpected " + Std.string(this.token) + " at " + Std.string(this.pos);
	}
	,__class__: hxparse.Unexpected
};
hxparse.UnexpectedChar = function(char,pos) {
	this.char = char;
	this.pos = pos;
};
hxparse.UnexpectedChar.__name__ = true;
hxparse.UnexpectedChar.prototype = {
	toString: function() {
		return "" + Std.string(this.pos) + ": Unexpected " + this.char;
	}
	,__class__: hxparse.UnexpectedChar
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
haxe.Resource.content = [{ name : "config", data : "ewoJIm1heGltdW1fbGluZV9sZW5ndGgiOjgwLAoJIm1vZGlmaWVyX29yZGVyIjpbIm92ZXJyaWRlIiwgInB1YmxpYyIsICJwcml2YXRlIiwgInN0YXRpYyIsICJleHRlcm4iLCAiZHluYW1pYyIsICJpbmxpbmUiLCAibWFjcm8iXSwKCSJpbmRlbnRfd2l0aF90YWJzIjpmYWxzZSwKCSJ0YWJfd2lkdGgiOjQsCgkicHJpbnRfcm9vdF9wYWNrYWdlIjpmYWxzZSwKCSJlbXB0eV9saW5lX2FmdGVyX3BhY2thZ2UiOnRydWUsCgkiZW1wdHlfbGluZV9hZnRlcl9pbXBvcnQiOmZhbHNlLAoJImVtcHR5X2xpbmVfYmVmb3JlX3R5cGUiOnRydWUsCgkiY3VkZGxlX3R5cGVfYnJhY2VzIjpmYWxzZSwKCSJjdWRkbGVfbWV0aG9kX2JyYWNlcyI6ZmFsc2UsCgkiZW1wdHlfbGluZV9iZXR3ZWVuX2ZpZWxkcyI6dHJ1ZSwKCSJzcGFjZV9iZXR3ZWVuX3R5cGVfcGFyYW1zIjp0cnVlLAoJInNwYWNlX2JldHdlZW5fYW5vbl90eXBlX2ZpZWxkcyI6dHJ1ZSwKCSJzcGFjZV9iZXR3ZWVuX3R5cGVfcGFyYW1fY29uc3RyYWludHMiOnRydWUsCgkiaW5saW5lX2VtcHR5X2JyYWNlcyI6dHJ1ZSwKCSJleHRlbmRzX29uX25ld2xpbmUiOmZhbHNlLAoJImltcGxlbWVudHNfb25fbmV3bGluZSI6ZmFsc2UsCgkiZnVuY3Rpb25fYXJnX29uX25ld2xpbmUiOmZhbHNlLAoJInNwYWNlX2JldHdlZW5fZnVuY3Rpb25fYXJncyI6dHJ1ZSwKCSJzcGFjZV9hcm91bmRfZnVuY3Rpb25fYXJnX2Fzc2lnbiI6dHJ1ZSwKCSJzcGFjZV9hcm91bmRfcHJvcGVydHlfYXNzaWduIjp0cnVlLAoJInNwYWNlX2JldHdlbl9wcm9wZXJ0eV9nZXRfc2V0Ijp0cnVlLAoJInJlbW92ZV9wcml2YXRlX2ZpZWxkX21vZGlmaWVyIjp0cnVlLAoJImVtcHR5X2xpbmVfYmV0d2Vlbl9lbnVtX2NvbnN0cnVjdG9ycyI6ZmFsc2UsCgkiZW1wdHlfbGluZV9iZXR3ZWVuX3R5cGVkZWZfZmllbGRzIjpmYWxzZSwKCSJzcGFjZV9iZXR3ZWVuX2VudW1fY29uc3RydWN0b3JfYXJncyI6dHJ1ZQp9"},{ name : "source", data : "ICAKCQoKICAgCXBhY2thZ2UgICAgCSAgZm9vLmJhciAgCSA7CgoKICAgCWltcG9ydCBoYXhlLmRzLio7CiAgIAkKCiAgIAlpbXBvcnQgaGF4ZS5IdHRwIGluIEhheGVIdHRwOwoKCiAgaW1wb3J0IGhheGUuSnNvbjsKCiAJICBjbGFzcyAgCSBUZXN0U291cmNlICA8VDooU3RyaW5nLEludCk+IGV4dGVuZHMgYmFyLkZvbzxBcnJheTxTdHJpbmc+PiBpbXBsZW1lbnRzIEJhcjxJbnQsIEZsb2F0PiBpbXBsZW1lbnRzIFN0cmluZwkKCiAJICAJewogICAKCiAgIHB1YmxpYyB2YXIgZm9vOkJhcjsKCiAgIAlwcml2YXRlIHZhciAgICBiYXogPSAgMQogICAJCTsKICAgdmFyIGJvbzpCYXI8VD4gPTEyLjE7CgogICB2YXIgcHJvcCgKICAgCWdldCwgc2V0KTpJbnQgPSAxOwoKIAkgIHB1YmxpYyBmdW5jdGlvbiBuZXcoKQogCSAgewogCSAgCWlmICh0cnVlKSB0cmFjZSgnaGVsbG8gd29ybGQnKTsKIAkgIH0KCiAJICBwcml2YXRlIHN0YXRpYyBtYWNybyBpbmxpbmUgZnVuY3Rpb24gZm9vPFQ6KEludCxCb29sKT4oYTpTdHJpbmcsIGI6QXJyYXk8SW50PiwgYywgP2Q6Rm9vLCA/ZTpJbnQ9MTApOkxpc3Q8e3g6SW50LCB5OkludH0+ICAgICAgeyAgCgogCWRvU3R1ZmYoKTsKCiAJCQkJInNvIHdoaXRlc3BhY2UiOwoKIAkJCQkJCQkJCSJtYW55IGFsaWdubWVudCI7CiAJCQkJCQkid293IjsKCgogCQkJInN1Y2ggbGF5b3V0IjsKIAkgIAkJfQoKCiAJIH0gICAJIAoKICBleHRlcm4gICAgcHJpdmF0ZSBjbGFzcyBBbm90aGVyIHt9CgoKICAJaW50ZXJmYWNlICAgRm9vIHsgICB9CgoKIHByaXZhdGUgZXh0ZXJuIAllbnVtIEZvb2Q8VD4KCQkJewkKCUx1bmNoPFQ+OwoKCURpbm5lcihzdGFydGVyOlN0cmluZywgZGVzc2VydCAgOiAgVCk7Cn0KCmVudW0gQmxhaCB7fQoKdHlwZWRlZiBSZWYgPSBoYXhlLm1hY3JvLkV4cHI7Cgp0eXBlZGVmIE15RGVmPEEsQj4gPSAgIHsKCW5hbWUgICA6IFN0cmluZywKCWZsYWdzIDogICBBcnJheTxBPiwKCWRhdGE6IEIKfQoK"}];
byte._LittleEndianWriter.LittleEndianWriter_Impl_.LN2 = Math.log(2);
haxe.crypto.Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe.crypto.Base64.BYTES = haxe.io.Bytes.ofString(haxe.crypto.Base64.CHARS);
hxparse.LexEngine.MAX_CODE = 255;
hxparse.LexEngine.EMPTY = [];
hxparse.LexEngine.ALL_CHARS = [{ min : 0, max : 255}];
haxeparser.HaxeLexer.keywords = (function($this) {
	var $r;
	var _g = new haxe.ds.StringMap();
	_g.set("abstract",haxeparser.Keyword.KwdAbstract);
	_g.set("break",haxeparser.Keyword.KwdBreak);
	_g.set("case",haxeparser.Keyword.KwdCase);
	_g.set("cast",haxeparser.Keyword.KwdCast);
	_g.set("catch",haxeparser.Keyword.KwdCatch);
	_g.set("class",haxeparser.Keyword.KwdClass);
	_g.set("continue",haxeparser.Keyword.KwdContinue);
	_g.set("default",haxeparser.Keyword.KwdDefault);
	_g.set("do",haxeparser.Keyword.KwdDo);
	_g.set("dynamic",haxeparser.Keyword.KwdDynamic);
	_g.set("else",haxeparser.Keyword.KwdElse);
	_g.set("enum",haxeparser.Keyword.KwdEnum);
	_g.set("extends",haxeparser.Keyword.KwdExtends);
	_g.set("extern",haxeparser.Keyword.KwdExtern);
	_g.set("false",haxeparser.Keyword.KwdFalse);
	_g.set("for",haxeparser.Keyword.KwdFor);
	_g.set("function",haxeparser.Keyword.KwdFunction);
	_g.set("if",haxeparser.Keyword.KwdIf);
	_g.set("implements",haxeparser.Keyword.KwdImplements);
	_g.set("import",haxeparser.Keyword.KwdImport);
	_g.set("in",haxeparser.Keyword.KwdIn);
	_g.set("inline",haxeparser.Keyword.KwdInline);
	_g.set("interface",haxeparser.Keyword.KwdInterface);
	_g.set("macro",haxeparser.Keyword.KwdMacro);
	_g.set("new",haxeparser.Keyword.KwdNew);
	_g.set("null",haxeparser.Keyword.KwdNull);
	_g.set("override",haxeparser.Keyword.KwdOverride);
	_g.set("package",haxeparser.Keyword.KwdPackage);
	_g.set("private",haxeparser.Keyword.KwdPrivate);
	_g.set("public",haxeparser.Keyword.KwdPublic);
	_g.set("return",haxeparser.Keyword.KwdReturn);
	_g.set("static",haxeparser.Keyword.KwdStatic);
	_g.set("switch",haxeparser.Keyword.KwdSwitch);
	_g.set("this",haxeparser.Keyword.KwdThis);
	_g.set("throw",haxeparser.Keyword.KwdThrow);
	_g.set("true",haxeparser.Keyword.KwdTrue);
	_g.set("try",haxeparser.Keyword.KwdTry);
	_g.set("typedef",haxeparser.Keyword.KwdTypedef);
	_g.set("untyped",haxeparser.Keyword.KwdUntyped);
	_g.set("using",haxeparser.Keyword.KwdUsing);
	_g.set("var",haxeparser.Keyword.KwdVar);
	_g.set("while",haxeparser.Keyword.KwdWhile);
	$r = _g;
	return $r;
}(this));
haxeparser.HaxeLexer.buf = new StringBuf();
haxeparser.HaxeLexer.ident = "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*";
haxeparser.HaxeLexer.idtype = "_*[A-Z][a-zA-Z0-9_]*";
haxeparser.HaxeLexer.tok = hxparse.Lexer.buildRuleset([{ rule : "", func : function(lexer) {
	return haxeparser.HaxeLexer.mk(lexer,haxeparser.TokenDef.Eof);
}},{ rule : "[\r\n\t ]", func : function(lexer1) {
	return lexer1.token(haxeparser.HaxeLexer.tok);
}},{ rule : "0x[0-9a-fA-F]+", func : function(lexer2) {
	return haxeparser.HaxeLexer.mk(lexer2,haxeparser.TokenDef.Const(haxe.macro.Constant.CInt(lexer2.current)));
}},{ rule : "[0-9]+", func : function(lexer3) {
	return haxeparser.HaxeLexer.mk(lexer3,haxeparser.TokenDef.Const(haxe.macro.Constant.CInt(lexer3.current)));
}},{ rule : "[0-9]+.[0-9]+", func : function(lexer4) {
	return haxeparser.HaxeLexer.mk(lexer4,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer4.current)));
}},{ rule : ".[0-9]+", func : function(lexer5) {
	return haxeparser.HaxeLexer.mk(lexer5,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer5.current)));
}},{ rule : "[0-9]+[eE][\\+\\-]?[0-9]+", func : function(lexer6) {
	return haxeparser.HaxeLexer.mk(lexer6,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer6.current)));
}},{ rule : "[0-9]+.[0-9]*[eE][\\+\\-]?[0-9]+", func : function(lexer7) {
	return haxeparser.HaxeLexer.mk(lexer7,haxeparser.TokenDef.Const(haxe.macro.Constant.CFloat(lexer7.current)));
}},{ rule : "[0-9]+...", func : function(lexer8) {
	return haxeparser.HaxeLexer.mk(lexer8,haxeparser.TokenDef.IntInterval(HxOverrides.substr(lexer8.current,0,-3)));
}},{ rule : "//[^\n\r]*", func : function(lexer9) {
	return haxeparser.HaxeLexer.mk(lexer9,haxeparser.TokenDef.CommentLine(HxOverrides.substr(lexer9.current,2,null)));
}},{ rule : "+\\+", func : function(lexer10) {
	return haxeparser.HaxeLexer.mk(lexer10,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpIncrement));
}},{ rule : "--", func : function(lexer11) {
	return haxeparser.HaxeLexer.mk(lexer11,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpDecrement));
}},{ rule : "~", func : function(lexer12) {
	return haxeparser.HaxeLexer.mk(lexer12,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpNegBits));
}},{ rule : "%=", func : function(lexer13) {
	return haxeparser.HaxeLexer.mk(lexer13,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMod)));
}},{ rule : "&=", func : function(lexer14) {
	return haxeparser.HaxeLexer.mk(lexer14,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAnd)));
}},{ rule : "|=", func : function(lexer15) {
	return haxeparser.HaxeLexer.mk(lexer15,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpOr)));
}},{ rule : "^=", func : function(lexer16) {
	return haxeparser.HaxeLexer.mk(lexer16,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpXor)));
}},{ rule : "+=", func : function(lexer17) {
	return haxeparser.HaxeLexer.mk(lexer17,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpAdd)));
}},{ rule : "-=", func : function(lexer18) {
	return haxeparser.HaxeLexer.mk(lexer18,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpSub)));
}},{ rule : "*=", func : function(lexer19) {
	return haxeparser.HaxeLexer.mk(lexer19,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpMult)));
}},{ rule : "/=", func : function(lexer20) {
	return haxeparser.HaxeLexer.mk(lexer20,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpDiv)));
}},{ rule : "<<=", func : function(lexer21) {
	return haxeparser.HaxeLexer.mk(lexer21,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssignOp(haxe.macro.Binop.OpShl)));
}},{ rule : "==", func : function(lexer22) {
	return haxeparser.HaxeLexer.mk(lexer22,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpEq));
}},{ rule : "!=", func : function(lexer23) {
	return haxeparser.HaxeLexer.mk(lexer23,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpNotEq));
}},{ rule : "<=", func : function(lexer24) {
	return haxeparser.HaxeLexer.mk(lexer24,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpLte));
}},{ rule : "&&", func : function(lexer25) {
	return haxeparser.HaxeLexer.mk(lexer25,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpBoolAnd));
}},{ rule : "|\\|", func : function(lexer26) {
	return haxeparser.HaxeLexer.mk(lexer26,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpBoolOr));
}},{ rule : "<<", func : function(lexer27) {
	return haxeparser.HaxeLexer.mk(lexer27,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpShl));
}},{ rule : "->", func : function(lexer28) {
	return haxeparser.HaxeLexer.mk(lexer28,haxeparser.TokenDef.Arrow);
}},{ rule : "...", func : function(lexer29) {
	return haxeparser.HaxeLexer.mk(lexer29,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpInterval));
}},{ rule : "=>", func : function(lexer30) {
	return haxeparser.HaxeLexer.mk(lexer30,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpArrow));
}},{ rule : "!", func : function(lexer31) {
	return haxeparser.HaxeLexer.mk(lexer31,haxeparser.TokenDef.Unop(haxe.macro.Unop.OpNot));
}},{ rule : "<", func : function(lexer32) {
	return haxeparser.HaxeLexer.mk(lexer32,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpLt));
}},{ rule : ">", func : function(lexer33) {
	return haxeparser.HaxeLexer.mk(lexer33,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpGt));
}},{ rule : ";", func : function(lexer34) {
	return haxeparser.HaxeLexer.mk(lexer34,haxeparser.TokenDef.Semicolon);
}},{ rule : ":", func : function(lexer35) {
	return haxeparser.HaxeLexer.mk(lexer35,haxeparser.TokenDef.DblDot);
}},{ rule : ",", func : function(lexer36) {
	return haxeparser.HaxeLexer.mk(lexer36,haxeparser.TokenDef.Comma);
}},{ rule : ".", func : function(lexer37) {
	return haxeparser.HaxeLexer.mk(lexer37,haxeparser.TokenDef.Dot);
}},{ rule : "%", func : function(lexer38) {
	return haxeparser.HaxeLexer.mk(lexer38,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpMod));
}},{ rule : "&", func : function(lexer39) {
	return haxeparser.HaxeLexer.mk(lexer39,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAnd));
}},{ rule : "|", func : function(lexer40) {
	return haxeparser.HaxeLexer.mk(lexer40,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpOr));
}},{ rule : "^", func : function(lexer41) {
	return haxeparser.HaxeLexer.mk(lexer41,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpXor));
}},{ rule : "+", func : function(lexer42) {
	return haxeparser.HaxeLexer.mk(lexer42,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAdd));
}},{ rule : "*", func : function(lexer43) {
	return haxeparser.HaxeLexer.mk(lexer43,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpMult));
}},{ rule : "/", func : function(lexer44) {
	return haxeparser.HaxeLexer.mk(lexer44,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpDiv));
}},{ rule : "-", func : function(lexer45) {
	return haxeparser.HaxeLexer.mk(lexer45,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpSub));
}},{ rule : "=", func : function(lexer46) {
	return haxeparser.HaxeLexer.mk(lexer46,haxeparser.TokenDef.Binop(haxe.macro.Binop.OpAssign));
}},{ rule : "[", func : function(lexer47) {
	return haxeparser.HaxeLexer.mk(lexer47,haxeparser.TokenDef.BkOpen);
}},{ rule : "]", func : function(lexer48) {
	return haxeparser.HaxeLexer.mk(lexer48,haxeparser.TokenDef.BkClose);
}},{ rule : "{", func : function(lexer49) {
	return haxeparser.HaxeLexer.mk(lexer49,haxeparser.TokenDef.BrOpen);
}},{ rule : "}", func : function(lexer50) {
	return haxeparser.HaxeLexer.mk(lexer50,haxeparser.TokenDef.BrClose);
}},{ rule : "\\(", func : function(lexer51) {
	return haxeparser.HaxeLexer.mk(lexer51,haxeparser.TokenDef.POpen);
}},{ rule : "\\)", func : function(lexer52) {
	return haxeparser.HaxeLexer.mk(lexer52,haxeparser.TokenDef.PClose);
}},{ rule : "?", func : function(lexer53) {
	return haxeparser.HaxeLexer.mk(lexer53,haxeparser.TokenDef.Question);
}},{ rule : "@", func : function(lexer54) {
	return haxeparser.HaxeLexer.mk(lexer54,haxeparser.TokenDef.At);
}},{ rule : "\"", func : function(lexer55) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin = new hxparse.Position(lexer55.source,lexer55.pos - lexer55.current.length,lexer55.pos);
	var pmax;
	try {
		pmax = lexer55.token(haxeparser.HaxeLexer.string);
	} catch( e ) {
		if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedString,haxeparser.HaxeLexer.mkPos(pmin));
		} else throw(e);
	}
	var token = haxeparser.HaxeLexer.mk(lexer55,haxeparser.TokenDef.Const(haxe.macro.Constant.CString(haxeparser.HaxeLexer.buf.b)));
	token.pos.min = pmin.pmin;
	return token;
}},{ rule : "'", func : function(lexer56) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin1 = new hxparse.Position(lexer56.source,lexer56.pos - lexer56.current.length,lexer56.pos);
	var pmax1;
	try {
		pmax1 = lexer56.token(haxeparser.HaxeLexer.string2);
	} catch( e1 ) {
		if( js.Boot.__instanceof(e1,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedString,haxeparser.HaxeLexer.mkPos(pmin1));
		} else throw(e1);
	}
	var token1 = haxeparser.HaxeLexer.mk(lexer56,haxeparser.TokenDef.Const(haxe.macro.Constant.CString(haxeparser.HaxeLexer.buf.b)));
	token1.pos.min = pmin1.pmin;
	return token1;
}},{ rule : "~/", func : function(lexer57) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin2 = new hxparse.Position(lexer57.source,lexer57.pos - lexer57.current.length,lexer57.pos);
	var info;
	try {
		info = lexer57.token(haxeparser.HaxeLexer.regexp);
	} catch( e2 ) {
		if( js.Boot.__instanceof(e2,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnterminatedRegExp,haxeparser.HaxeLexer.mkPos(pmin2));
		} else throw(e2);
	}
	var token2 = haxeparser.HaxeLexer.mk(lexer57,haxeparser.TokenDef.Const(haxe.macro.Constant.CRegexp(haxeparser.HaxeLexer.buf.b,info.opt)));
	token2.pos.min = pmin2.pmin;
	return token2;
}},{ rule : "/\\*", func : function(lexer58) {
	haxeparser.HaxeLexer.buf = new StringBuf();
	var pmin3 = new hxparse.Position(lexer58.source,lexer58.pos - lexer58.current.length,lexer58.pos);
	var pmax2;
	try {
		pmax2 = lexer58.token(haxeparser.HaxeLexer.comment);
	} catch( e3 ) {
		if( js.Boot.__instanceof(e3,haxe.io.Eof) ) {
			throw new haxeparser.LexerError(haxeparser.LexerErrorMsg.UnclosedComment,haxeparser.HaxeLexer.mkPos(pmin3));
		} else throw(e3);
	}
	var token3 = haxeparser.HaxeLexer.mk(lexer58,haxeparser.TokenDef.Comment(haxeparser.HaxeLexer.buf.b));
	token3.pos.min = pmin3.pmin;
	return token3;
}},{ rule : "(#)(_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*)", func : function(lexer59) {
	return haxeparser.HaxeLexer.mk(lexer59,haxeparser.TokenDef.Sharp(HxOverrides.substr(lexer59.current,1,null)));
}},{ rule : "($)(_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*)", func : function(lexer60) {
	return haxeparser.HaxeLexer.mk(lexer60,haxeparser.TokenDef.Dollar(HxOverrides.substr(lexer60.current,1,null)));
}},{ rule : "_*[a-z][a-zA-Z0-9_]*|_+|_+[0-9][_a-zA-Z0-9]*", func : function(lexer61) {
	var kwd = haxeparser.HaxeLexer.keywords.get(lexer61.current);
	if(kwd != null) return haxeparser.HaxeLexer.mk(lexer61,haxeparser.TokenDef.Kwd(kwd)); else return haxeparser.HaxeLexer.mk(lexer61,haxeparser.TokenDef.Const(haxe.macro.Constant.CIdent(lexer61.current)));
}},{ rule : "_*[A-Z][a-zA-Z0-9_]*", func : function(lexer62) {
	return haxeparser.HaxeLexer.mk(lexer62,haxeparser.TokenDef.Const(haxe.macro.Constant.CIdent(lexer62.current)));
}}]);
haxeparser.HaxeLexer.string = hxparse.Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "\\";
	return lexer.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\n", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer1.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\r", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer2.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.string);
}},{ rule : "\\\\\"", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += "\"";
	return lexer4.token(haxeparser.HaxeLexer.string);
}},{ rule : "\"", func : function(lexer5) {
	return new hxparse.Position(lexer5.source,lexer5.pos - lexer5.current.length,lexer5.pos).pmax;
}},{ rule : "[^\\\\\"]+", func : function(lexer6) {
	haxeparser.HaxeLexer.buf.b += lexer6.current;
	return lexer6.token(haxeparser.HaxeLexer.string);
}}]);
haxeparser.HaxeLexer.string2 = hxparse.Lexer.buildRuleset([{ rule : "\\\\\\\\", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "\\";
	return lexer.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\n", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer1.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\r", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer2.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.string2);
}},{ rule : "\\\\'", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += "\"";
	return lexer4.token(haxeparser.HaxeLexer.string2);
}},{ rule : "'", func : function(lexer5) {
	return new hxparse.Position(lexer5.source,lexer5.pos - lexer5.current.length,lexer5.pos).pmax;
}},{ rule : "[^\\\\']+", func : function(lexer6) {
	haxeparser.HaxeLexer.buf.b += lexer6.current;
	return lexer6.token(haxeparser.HaxeLexer.string2);
}}]);
haxeparser.HaxeLexer.comment = hxparse.Lexer.buildRuleset([{ rule : "*/", func : function(lexer) {
	return new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax;
}},{ rule : "*", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "*";
	return lexer1.token(haxeparser.HaxeLexer.comment);
}},{ rule : "[^\\*]", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += lexer2.current;
	return lexer2.token(haxeparser.HaxeLexer.comment);
}}]);
haxeparser.HaxeLexer.regexp = hxparse.Lexer.buildRuleset([{ rule : "\\\\/", func : function(lexer) {
	haxeparser.HaxeLexer.buf.b += "/";
	return lexer.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\r", func : function(lexer1) {
	haxeparser.HaxeLexer.buf.b += "\r";
	return lexer1.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\n", func : function(lexer2) {
	haxeparser.HaxeLexer.buf.b += "\n";
	return lexer2.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\t", func : function(lexer3) {
	haxeparser.HaxeLexer.buf.b += "\t";
	return lexer3.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\[\\$\\.*+\\^|{}\\[\\]()?\\-0-9]", func : function(lexer4) {
	haxeparser.HaxeLexer.buf.b += lexer4.current;
	return lexer4.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "\\\\[wWbBsSdDx]", func : function(lexer5) {
	haxeparser.HaxeLexer.buf.b += lexer5.current;
	return lexer5.token(haxeparser.HaxeLexer.regexp);
}},{ rule : "/", func : function(lexer6) {
	return lexer6.token(haxeparser.HaxeLexer.regexp_options);
}},{ rule : "[^\\\\/\r\n]+", func : function(lexer7) {
	haxeparser.HaxeLexer.buf.b += lexer7.current;
	return lexer7.token(haxeparser.HaxeLexer.regexp);
}}]);
haxeparser.HaxeLexer.regexp_options = hxparse.Lexer.buildRuleset([{ rule : "[gimsu]*", func : function(lexer) {
	return { pmax : new hxparse.Position(lexer.source,lexer.pos - lexer.current.length,lexer.pos).pmax, opt : lexer.current};
}}]);
haxeprinter.Demo.printer = new haxeprinter.Printer();
haxeprinter.Demo.main();
})();
