"""Shared SVG polygon helpers used by generation and pixel audits."""
import re

import cv2
import numpy as np


def path_polygons(path):
    return [
        np.array([
            [float(value) for value in pair.split(',')]
            for pair in re.findall(r'[\d.]+,[\d.]+', subpath)
        ], np.float32)
        for subpath in re.findall(r'M([^M]+?)Z', path)
    ]


def rasterize(paths, size):
    mask = np.zeros(size, np.uint8)
    for path in paths:
        polygons = [np.rint(polygon).astype(np.int32) for polygon in path_polygons(path)]
        if polygons:
            # OpenCV fillPoly uses parity for compound contours, like SVG evenodd.
            cv2.fillPoly(mask, polygons, 1)
    return mask


def contour_path(contour, tolerance):
    points = cv2.approxPolyDP(contour, tolerance, True)[:, 0, :]
    if len(points) < 3:
        x, y, width, height = cv2.boundingRect(contour)
        points = np.array([
            [x - .5, y - .5], [x + width - .5, y - .5],
            [x + width - .5, y + height - .5], [x - .5, y + height - .5],
        ])
    return 'M' + ' L'.join(f'{x:g},{y:g}' for x, y in points) + ' Z'


def trace_mask(mask, tolerance):
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    if hierarchy is None:
        return []
    paths = []
    for index, contour in enumerate(contours):
        if hierarchy[0, index, 3] != -1:
            continue
        path = contour_path(contour, tolerance)
        child = hierarchy[0, index, 2]
        while child != -1:
            path += ' ' + contour_path(contours[child], tolerance)
            child = hierarchy[0, child, 0]
        paths.append(path)
    return paths
