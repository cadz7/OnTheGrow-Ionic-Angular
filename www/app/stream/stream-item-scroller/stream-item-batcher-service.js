angular.module('sproutApp.stream-item-scroller.batcher', [
  'sproutApp.data.stream-items',
  'sproutApp.stream-item-renderer' 
])

// Paginates stream items into batches.
.factory('streamItemPaginator', ['streamItems', 'streamItemRenderer', '$q', '$log',
  function(streamItems, streamItemRenderer, $q, $log) {
    var service = {};

    var batchCounter = 0;
    var batchRecords = {};
    var containerElement;
    var numberHiddenBelow = 0;

    // Returns a promise that resolves when all items in the batch have been
    // rendered.
    function waitForAllItemsToRender(items) {
      return $q.all(_.map(items, streamItemRenderer.render));
    }

    // Make a placeholder for each item.
    function makeItemPlaceholderHTML(item) {
      var body = item.streamItemId;
      return '<div style="height:250px">' + body + '</div>'; //...'; //<div style="height:690px; border: 1px solid blue;">...</div>';
    }

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

      var batchRecord = {};
      var batchId = 'stream_item_batch_' + batchCounter;
      var placeholders = _.map(items, makeItemPlaceholderHTML);
      var batchDiv = batchRecord.element = document.createElement('div');

      batchCounter++;
      numberHiddenBelow++;

      batchDiv.setAttribute('id', batchId);
      batchDiv.setAttribute('style', 'border: 3px solid blue; margin-bottom: 20px');
      window.requestAnimationFrame(function() {
        containerElement.appendChild(batchDiv);
        window.requestAnimationFrame(function() {
          batchDiv.innerHTML = placeholders.join('');
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
      if (batchRecord.stubified) {
        console.log('already stubified', batchId);
        return;
      }
      console.time('stubifyBatch');
      batchRecord.stubified = true;
      console.log('stubifying:', batchId);
      batchElement.style.display = 'block';
      batchElement.setAttribute('style','height:' + batchElement.offsetHeight + 'px;border: 3px solid red; background-color: orange; margin-bottom: 20px'); 
      batchElement.innerHTML = '<div>Stub for batch #' + batchId + '</div>';
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
      batchRecord.whenReady.then(function() {
        if (!batchRecord.stubified) {
          // window.requestAnimationFrame(function() {
          batchElement.innerHTML = batchRecord.html;
        }
      });
    };

    /**
     * Lets us know if ther service is running on pre-loaded batches.
     *
     * @return {Boolean} [description]
     */
    service.isRunningLow = function() {
      return numberHiddenBelow < 3;
    };

    return service;
  }

]);