angular.module('sproutApp.stream-item-scroller.batcher', [
  'sproutApp.data.stream-items',
  'sproutApp.stream-item-renderer' 
])

// Breaks up stream items into batches and does the work of putting those
// batches into DOM and taking the off DOM.
.factory('streamItemBatcher', ['streamItems', 'streamItemRenderer', '$q', '$log',
  function(streamItems, streamItemRenderer, $q, $log) {
    'use strict';
    var service = {};
    var batchCounter = 0;
    var batchRecords = {};
    var containerElement;
    var numberHiddenBelow = 0;
    var batchRecordsArray = [];

    // Flashes the stubbed items.
    function shimmer() {
      batchRecordsArray.forEach(function(batch) {
        if (batch.stubified) {
          batch.stub.className = 'item post streamItemStubShimmerB';
          setTimeout(function() {
            if (batch.stubified) {
              batch.stub.className = 'item post streamItemStubShimmerA';
            }
          }, 300);
        }
      });
    }

    setInterval(shimmer, 1500);

    // A replacement for requestAnimationFrame if its not defined.
    window.requestAnimationFrame = window.requestAnimationFrame || function(callback) {
      setTimeout(callback, 10);
    };

    // Returns a promise that resolves when all items in the batch have been
    // rendered.
    function waitForAllItemsToRender(items) {
      return $q.all(_.map(items, streamItemRenderer.render));
    }

    /**
     * Sets the element that will serve as the container for batch divs.
     *
     * @param {element} newContainerElement    A DOM element to be used as the
     *                                         container.
     */
    service.setContainerElement = function(newContainerElement) {
      containerElement = newContainerElement;
    };

    /**
     * Lazy-loads a batch of items to the parent.
     *
     * @param {array} items            An array of stream items.
     */
    service.addBatch = function(items) {

      if (items.length === 0) {
        return;
      }

      var batchRecord = {stubified: true};
      var batchId = 'stream_item_batch_' + batchCounter;
      var batchDiv = batchRecord.element = document.createElement('div');

      batchCounter++;
      numberHiddenBelow++;

      batchRecordsArray.push(batchRecord);

      batchDiv.setAttribute('id', batchId);
      // batchDiv.setAttribute('style', 'border: 3px solid blue; margin-bottom: 20px');
      window.requestAnimationFrame(function() {
        containerElement.appendChild(batchDiv);
        window.requestAnimationFrame(function() {
          batchRecord.stub = document.createElement('div');
          batchRecord.stub.setAttribute('style', 'height:600px;');
          batchRecord.stub.className = 'item post';
          batchDiv.appendChild(batchRecord.stub);
        });
      });

      batchRecord.whenReady = waitForAllItemsToRender(items)
        .then(function(renderedItems) {
          batchRecord.html = renderedItems.join('');
        })
        .then(null, $log.error);

      batchRecords[batchId] = batchRecord;
    };

    // Gets the batch record based on an element.
    function getBatchRecord(batchElement) {
      return batchRecords[batchElement.getAttribute('id')];
    }

    /**
     * Replaces a hidden batch of items with a stub of the same height.
     *
     * @param  {element} batchElement   A dom element representing the batch.
     * @return {undefined}              Nothing is returned.
     */
    service.stubifyBatch = function (batchElement) {
      var batchRecord = getBatchRecord(batchElement);
      var batchId = batchElement.getAttribute('id');
      batchRecord.stubified = true;
      console.time('stubifyBatch');
      console.log('stubifying:', batchId);
      batchElement.style.display = 'block';
      batchElement.setAttribute('style','height:' + batchElement.offsetHeight + 'px');
      //;border: 3px solid red; background-color: orange; margin-bottom: 20px'); 
      batchElement.innerHTML = '';
      batchElement.appendChild(batchRecord.stub);
      console.timeEnd('stubifyBatch');
    };

    /**
     * Fleshes out a stubbed batch by attaching children to it.
     *
     * @param  {[type]} batchElement [description]
     * @return {[type]}              [description]
     */
    service.fleshOutBatch = function(batchElement) {
      var batchRecord = getBatchRecord(batchElement);
      numberHiddenBelow--;
      batchRecord.stubified = false;
      batchRecord.element.className = 'streamItemStubBlank';
      batchRecord.whenReady.then(function() {
        // if (!batchRecord.stubified) {
          // window.requestAnimationFrame(function() {
        batchElement.innerHTML = batchRecord.html;
        batchRecord.element.className = 'streamItemStubReveal';
        // }
      });
    };

    /**
     * Lets us know if ther service is running on pre-loaded batches.
     *
     * @return {Boolean}              True if we need more items.
     */
    service.isRunningLow = function() {
      return numberHiddenBelow < 3;
    };

    /**
     * Lets us know if the service currently has no loaded items.
     *
     * @return {Boolean}               True if the service is empty.
     */
    service.isEmpty = function() {
      return batchCounter === 0;
    }

    return service;
  }

]);