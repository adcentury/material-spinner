/**
 * Material Spinner @ 0.0.9
 * @author Lei Lei
 * MIT License
 */

import jquerykeyframes from 'jquerykeyframes';

class Spinner {
  constructor(element, options) {
    const time = Date.now();
    this.options = options;
    this.$element = $(element);

    this.realRadius = this.options.radius - this.options.strokeWidth;

    this.rotateName = 'spin-rotate-' + time;
    this.dashName = 'spin-dash-' + time;

    this.defineKeyframes();
    this.createSvg();
  }
  defineKeyframes() {
    const dashSpace = this.options.radius * 8;
    const dashLength = [
      1,
      (this.realRadius * 4.7).toFixed(1),
      (this.realRadius * 4.7).toFixed(1)
    ];
    const dashOffset = [
      '0',
      (0 - (this.realRadius * 1.75)).toFixed(1),
      (0 - (this.realRadius * 6.23)).toFixed(1)
    ];
    $.keyframe.define([{
      name: this.rotateName,
      from: {
        'transform': 'rotate(0deg)'
      },
      to: {
        'transform': 'rotate(360deg)'
      }
    }, {
      name: this.dashName,
      '0%': {
        'stroke-dasharray': dashLength[0] + ',' + dashSpace,
        'stroke-dashoffset': dashOffset[0]
      },
      '50%': {
        'stroke-dasharray': dashLength[1] + ',' + dashSpace,
        'stroke-dashoffset': dashOffset[1]
      },
      '100%': {
        'stroke-dasharray': dashLength[2] + ',' + dashSpace,
        'stroke-dashoffset': dashOffset[2]
      }
    }]);
  }
  createSvg() {
    const {radius, strokeWidth} = this.options;
    const dashSpace = this.options.radius * 8;
    this.$element.append(this.makeSvg('svg', {
      width: radius * 2,
      height: radius * 2
    }));
    const $svg = this.$element.find('svg');
    $svg.append(this.makeSvg('circle', {
      cx: radius,
      cy: radius,
      r: this.realRadius,
      fill: 'none',
      'stroke-width': strokeWidth
    }));
    const $circle = $svg.find('circle').css({
      'stroke-dasharray': '1,' + dashSpace,
      'stroke-dashoffset': '0',
      'stroke-linecap': 'round',
      'stroke': this.options.color
    });
    $svg.playKeyframe(
      this.rotateName + ' ' + this.options.duration + 's linear infinite'
    );
    const circleDuration = this.options.duration / 4.0 * 3.0;
    $circle.playKeyframe(
      this.dashName + ' ' + circleDuration.toFixed(1) + 's ease-in-out infinite'
    );
  }
  makeSvg(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }
}

Spinner.VERSION = '0.0.1';

Spinner.DEFAULTS = {
  radius: 25,
  strokeWidth: 5,
  duration: 2,
  color: '#3f88f8'
};

function Plugin(option) {
  return this.each(() => {
    const $this = $(this);
    const options = $.extend({}, Spinner.DEFAULTS, option);

    if (!$this.data('spinnerHandler')) {
      $this.data('spinnerHandler', new Spinner(this, options));
    }
  });
}

$.fn.spinner = Plugin;
$.fn.spinner.Constructor = Spinner;

// Register data api
$(window).on('load', () => {
  $('[data-spinner]').each(function() {
    const $this = $(this);
    const option = $this.data('spinner');
    if (!$this.data('spinnerHandler')) {
      Plugin.call($this, option, this);
    }
  });
});
