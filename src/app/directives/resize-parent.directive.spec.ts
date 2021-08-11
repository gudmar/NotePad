import { ResizeParentDirective } from './resize-parent.directive';
import {Component, DebugElement, ElementRef, ViewChild, HostListener,  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import { MovablePointComponent } from '../movable-point/movable-point.component'
import { ConstantPool } from '@angular/compiler';
import { ConcatSource } from 'webpack-sources';



class MockElementRef implements ElementRef{
        nativeElement = {offsetLeft: 0, offsetTop: 0};
}

describe('ResizeParentDirective', () => {
    let elementRef = new MockElementRef();
  it('should create an instance', () => {
    const directive = new ResizeParentDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
